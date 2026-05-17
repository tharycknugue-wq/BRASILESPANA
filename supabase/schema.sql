-- BRASILESPAÑA · schema inicial Supabase
-- Rodar este arquivo no SQL editor do projeto Supabase.
-- Idempotente: pode ser executado mais de uma vez sem erro.

-- ─────────────────────────────────────────────────────────
-- profiles: estende auth.users com dados públicos do usuário
-- ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null
                 check (
                   char_length(username) between 3 and 20
                   and username ~ '^[a-z0-9_]+$'
                 ),
  full_name    text,
  whatsapp     text,
  lang         text default 'pt' check (lang in ('pt','es')),
  account_type text not null default 'free' check (account_type in ('free','advertiser')),
  -- ── KYC do anunciante ──
  nationality  text check (nationality in ('brazilian','brazilian_dual')),
  is_autonomo  boolean default false,
  address      text,
  postal_code  text,
  city         text,
  province     text,
  country      text default 'España',
  kyc_status   text not null default 'none'
                 check (kyc_status in ('none','pending','verified','rejected')),
  kyc_note     text,           -- motivo de rejeição (preenchido na revisão manual)
  referred_by  uuid references auth.users(id) on delete set null,  -- quem indicou
  created_at   timestamptz default now()
);
create index if not exists profiles_username_idx on public.profiles(username);
create index if not exists profiles_kyc_idx      on public.profiles(kyc_status);
alter table public.profiles enable row level security;

drop policy if exists "profiles: owner read"   on public.profiles;
drop policy if exists "profiles: owner write"  on public.profiles;
drop policy if exists "profiles: owner delete" on public.profiles;
create policy "profiles: owner read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: owner write"  on public.profiles for update using (auth.uid() = id);
create policy "profiles: owner delete" on public.profiles for delete using (auth.uid() = id);

-- Função pública que retorna se um username está disponível (sem expor outros dados).
create or replace function public.username_available(u text) returns boolean as $$
  select not exists (select 1 from public.profiles where username = lower(u));
$$ language sql security definer stable;
grant execute on function public.username_available(text) to anon, authenticated;

-- Cria profile automaticamente quando usuário é criado via auth.signUp.
-- Se houver 'ref' (username de quem indicou) nos metadados, registra a indicação.
create or replace function public.handle_new_user() returns trigger as $$
declare
  ref_username text := lower(nullif(new.raw_user_meta_data->>'ref', ''));
  referrer_id  uuid;
begin
  if ref_username is not null then
    select id into referrer_id from public.profiles where username = ref_username;
  end if;

  insert into public.profiles (id, username, full_name, whatsapp, lang, account_type, referred_by)
  values (
    new.id,
    lower(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp', ''),
    coalesce(new.raw_user_meta_data->>'lang', 'pt'),
    coalesce(new.raw_user_meta_data->>'account_type', 'free'),
    referrer_id
  );

  -- Registra a recompensa de indicação (2,99 € = 299 cêntimos)
  if referrer_id is not null and referrer_id <> new.id then
    insert into public.referrals (referrer_id, referred_id, reward_cents, status)
    values (referrer_id, new.id, 299, 'pending')
    on conflict (referred_id) do nothing;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────
-- referrals: indicações (ganha 2,99 € = 299 cêntimos por novo usuário)
-- ─────────────────────────────────────────────────────────
create table if not exists public.referrals (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  uuid not null references auth.users(id) on delete cascade,
  referred_id  uuid not null references auth.users(id) on delete cascade,
  reward_cents int  not null default 299,
  status       text not null default 'pending' check (status in ('pending','approved','paid','cancelled')),
  created_at   timestamptz default now(),
  unique (referred_id)             -- cada usuário só pode ser indicado uma vez
);
create index if not exists referrals_referrer_idx on public.referrals(referrer_id);
alter table public.referrals enable row level security;

drop policy if exists "referrals: referrer read"   on public.referrals;
drop policy if exists "referrals: referrer delete" on public.referrals;
create policy "referrals: referrer read"   on public.referrals for select using (auth.uid() = referrer_id);
create policy "referrals: referrer delete" on public.referrals for delete using (auth.uid() = referrer_id);
-- inserts feitos pelo trigger handle_new_user (security definer);
-- mudanças de status (approved/paid) só via service role.

-- Resumo das minhas indicações (contagem + total ganho), sem expor terceiros.
create or replace function public.my_referral_stats()
returns table (total int, paid_cents int, pending_cents int) as $$
  select
    count(*)::int as total,
    coalesce(sum(reward_cents) filter (where status = 'paid'), 0)::int        as paid_cents,
    coalesce(sum(reward_cents) filter (where status in ('pending','approved')), 0)::int as pending_cents
  from public.referrals
  where referrer_id = auth.uid();
$$ language sql security definer stable;
grant execute on function public.my_referral_stats() to authenticated;

-- ─────────────────────────────────────────────────────────
-- documents: KYC do anunciante (dados sensíveis — bucket PRIVADO)
-- ─────────────────────────────────────────────────────────
create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null
                check (type in ('tie','nie','dni','passport','padron','alta_autonomo')),
  front_path  text not null,
  back_path   text,
  verified    boolean default false,
  created_at  timestamptz default now(),
  unique (user_id, type)
);
create index if not exists documents_user_idx on public.documents(user_id);
alter table public.documents enable row level security;

drop policy if exists "documents: owner read"   on public.documents;
drop policy if exists "documents: owner insert" on public.documents;
drop policy if exists "documents: owner update" on public.documents;
drop policy if exists "documents: owner delete" on public.documents;
create policy "documents: owner read"   on public.documents for select using (auth.uid() = user_id);
create policy "documents: owner insert" on public.documents for insert with check (auth.uid() = user_id);
create policy "documents: owner update" on public.documents for update using (auth.uid() = user_id);
create policy "documents: owner delete" on public.documents for delete using (auth.uid() = user_id);

-- Bucket PRIVADO para documentos de identidade (NUNCA público).
insert into storage.buckets (id, name, public) values ('kyc', 'kyc', false)
  on conflict (id) do nothing;

drop policy if exists "kyc: owner read"   on storage.objects;
drop policy if exists "kyc: owner upload" on storage.objects;
drop policy if exists "kyc: owner delete" on storage.objects;
create policy "kyc: owner read"   on storage.objects for select
  using (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "kyc: owner upload" on storage.objects for insert
  with check (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "kyc: owner delete" on storage.objects for delete
  using (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────
-- ads: anúncios publicados
-- ─────────────────────────────────────────────────────────
create table if not exists public.ads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  category     text not null,
  title        text not null,
  description  text not null,
  price        text,
  contact      text not null,
  comunidade   text,
  provincia    text,
  municipio    text,
  bairro       text,
  photos           jsonb default '[]'::jsonb,
  promo            boolean default false,
  delivery         jsonb,
  payment_methods  text[] default '{}',
  status       text default 'pending' check (status in ('pending','active','expired','removed')),
  featured     boolean default false,
  created_at   timestamptz default now(),
  expires_at   timestamptz default (now() + interval '30 days')
);
create index if not exists ads_category_idx  on public.ads(category);
create index if not exists ads_status_idx    on public.ads(status);
create index if not exists ads_user_idx      on public.ads(user_id);
create index if not exists ads_created_idx   on public.ads(created_at desc);
alter table public.ads enable row level security;

drop policy if exists "ads: public read active" on public.ads;
drop policy if exists "ads: owner read all"     on public.ads;
drop policy if exists "ads: advertiser insert"  on public.ads;
drop policy if exists "ads: owner update"       on public.ads;
drop policy if exists "ads: owner delete"       on public.ads;
create policy "ads: public read active"  on public.ads for select using (status = 'active');
create policy "ads: owner read all"      on public.ads for select using (auth.uid() = user_id);
-- Só anunciante com KYC verificado pode publicar
create policy "ads: advertiser insert"   on public.ads for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.account_type = 'advertiser'
        and p.kyc_status = 'verified'
    )
  );
create policy "ads: owner update"        on public.ads for update using (auth.uid() = user_id);
create policy "ads: owner delete"        on public.ads for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- advertiser_profiles: vitrine pública do anunciante
-- ─────────────────────────────────────────────────────────
create table if not exists public.advertiser_profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  headline      text,
  bio           text,
  logo_path     text,
  payment_methods text[] default '{}',
  delivery      jsonb,
  promo_active  boolean default false,
  -- contatos exibidos no cartão de visitas
  card_name     text,
  card_whatsapp text,
  card_phone    text,
  card_email    text,
  card_instagram text,
  card_facebook text,
  updated_at    timestamptz default now()
);
-- idempotente: garante colunas em bancos já existentes
alter table public.advertiser_profiles add column if not exists card_name      text;
alter table public.advertiser_profiles add column if not exists card_whatsapp  text;
alter table public.advertiser_profiles add column if not exists card_phone     text;
alter table public.advertiser_profiles add column if not exists card_email     text;
alter table public.advertiser_profiles add column if not exists card_instagram text;
alter table public.advertiser_profiles add column if not exists card_facebook  text;
alter table public.advertiser_profiles enable row level security;

drop policy if exists "adv_profiles: public read"  on public.advertiser_profiles;
drop policy if exists "adv_profiles: owner upsert"  on public.advertiser_profiles;
drop policy if exists "adv_profiles: owner update"  on public.advertiser_profiles;
drop policy if exists "adv_profiles: owner delete"  on public.advertiser_profiles;
create policy "adv_profiles: public read"  on public.advertiser_profiles for select using (true);
create policy "adv_profiles: owner upsert" on public.advertiser_profiles for insert with check (auth.uid() = user_id);
create policy "adv_profiles: owner update" on public.advertiser_profiles for update using (auth.uid() = user_id);
create policy "adv_profiles: owner delete" on public.advertiser_profiles for delete using (auth.uid() = user_id);

-- Bucket PÚBLICO para logos/fotos de vitrine (não sensível)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;
drop policy if exists "avatars: public read"  on storage.objects;
drop policy if exists "avatars: owner upload" on storage.objects;
drop policy if exists "avatars: owner delete" on storage.objects;
create policy "avatars: public read"  on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars: owner upload" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars: owner delete" on storage.objects for delete
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─────────────────────────────────────────────────────────
-- reviews: avaliações de anunciantes (1–5 + comentário)
-- ─────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references auth.users(id) on delete cascade,
  author_id     uuid not null references auth.users(id) on delete cascade,
  rating        int  not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz default now(),
  unique (advertiser_id, author_id)
);
create index if not exists reviews_advertiser_idx on public.reviews(advertiser_id);
alter table public.reviews enable row level security;

drop policy if exists "reviews: public read"   on public.reviews;
drop policy if exists "reviews: author insert" on public.reviews;
drop policy if exists "reviews: author update" on public.reviews;
drop policy if exists "reviews: author delete" on public.reviews;
create policy "reviews: public read"    on public.reviews for select using (true);
create policy "reviews: author insert"  on public.reviews for insert
  with check (auth.uid() = author_id and auth.uid() <> advertiser_id);
create policy "reviews: author update"  on public.reviews for update using (auth.uid() = author_id);
create policy "reviews: author delete"  on public.reviews for delete using (auth.uid() = author_id);

-- ─────────────────────────────────────────────────────────
-- RPC pública: resolve @username → dados públicos do anunciante
-- ─────────────────────────────────────────────────────────
create or replace function public.advertiser_by_username(u text)
returns table (
  user_id uuid, username text, full_name text, city text, province text,
  display_name text, headline text, bio text, logo_path text,
  payment_methods text[], delivery jsonb, promo_active boolean,
  card_name text, card_whatsapp text, card_phone text, card_email text,
  card_instagram text, card_facebook text,
  avg_rating numeric, review_count bigint
) as $$
  select
    p.id, p.username, p.full_name, p.city, p.province,
    ap.display_name, ap.headline, ap.bio, ap.logo_path,
    ap.payment_methods, ap.delivery, ap.promo_active,
    ap.card_name, ap.card_whatsapp, ap.card_phone, ap.card_email,
    ap.card_instagram, ap.card_facebook,
    coalesce(round(avg(r.rating)::numeric, 1), 0) as avg_rating,
    count(r.id) as review_count
  from public.profiles p
  left join public.advertiser_profiles ap on ap.user_id = p.id
  left join public.reviews r on r.advertiser_id = p.id
  where p.username = lower(u)
    and p.account_type = 'advertiser'
    and p.kyc_status = 'verified'
  group by p.id, p.username, p.full_name, p.city, p.province,
           ap.display_name, ap.headline, ap.bio, ap.logo_path,
           ap.payment_methods, ap.delivery, ap.promo_active,
           ap.card_name, ap.card_whatsapp, ap.card_phone, ap.card_email,
           ap.card_instagram, ap.card_facebook;
$$ language sql security definer stable;
grant execute on function public.advertiser_by_username(text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────
-- messages: formulário de contato público
-- ─────────────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  body        text not null,
  lang        text default 'pt',
  created_at  timestamptz default now()
);
alter table public.messages enable row level security;

drop policy if exists "messages: anyone insert" on public.messages;
create policy "messages: anyone insert" on public.messages for insert with check (true);
-- leitura só via service role (não criar policy de select pública)

-- ─────────────────────────────────────────────────────────
-- subscriptions: controle de assinatura PayPal
-- ─────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  paypal_sub_id   text unique,
  status          text not null check (status in ('active','cancelled','expired','past_due')),
  valid_until     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists subs_user_idx on public.subscriptions(user_id);
alter table public.subscriptions enable row level security;

drop policy if exists "subs: owner read" on public.subscriptions;
create policy "subs: owner read" on public.subscriptions for select using (auth.uid() = user_id);
-- inserts/updates só via service role (webhook PayPal)

-- ─────────────────────────────────────────────────────────
-- Storage bucket para fotos de anúncios
-- ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('ads', 'ads', true)
  on conflict (id) do nothing;

drop policy if exists "ads bucket: public read"  on storage.objects;
drop policy if exists "ads bucket: owner upload" on storage.objects;
drop policy if exists "ads bucket: owner delete" on storage.objects;
create policy "ads bucket: public read"  on storage.objects for select using (bucket_id = 'ads');
create policy "ads bucket: owner upload" on storage.objects for insert
  with check (bucket_id = 'ads' and auth.uid() is not null);
create policy "ads bucket: owner delete" on storage.objects for delete
  using (bucket_id = 'ads' and auth.uid()::text = (storage.foldername(name))[1]);
