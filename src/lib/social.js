// Configuração central de contato e redes sociais.
// Atualize aqui — todos os componentes leem deste arquivo.

export const CONTACT = {
  // E-mail público (rodapé, formulário de contato, "Fale com a gente")
  email:    'contato@plataformaconexaobr.com',
  // E-mail técnico/transacional da plataforma BRASILESPAÑA
  // (autenticação, notificações, password reset, contact form recipient)
  platform: 'brasilespana@plataformaconexaobr.com',
  // Canal RGPD/LGPD — solicitações de dados pessoais
  privacy:  'privacidade@plataformaconexaobr.com',
  // Telefone de suporte (preencher quando definido)
  phone:    '',
  // URL pública — o site é o Conexão BR; o app BRASILESPAÑA roda dentro dele
  website:  'https://plataformaconexaobr.com',
}

// Deixe vazio ('') o que ainda não existe — o componente esconde links vazios.
export const SOCIAL = {
  instagram: 'https://www.instagram.com/app.brasilespana',
  facebook:  'https://facebook.com/brasilespana',
  tiktok:    'https://tiktok.com/@brasilespana',
  youtube:   'https://youtube.com/@brasilespana',
  whatsapp:  '',
  telegram:  '',
}

export const TEAM = [
  { name: 'Michele Nuevo Guerra',  role: { pt: 'Fundadora e Idealizadora',     es: 'Fundadora e Idealizadora'      } },
  { name: 'Tharyck Nuevo Guerra',  role: { pt: 'Cofundador e Dev Tecnológico', es: 'Cofundador y Dev Tecnológico'  } },
  { name: 'Thayza Nuevo Guerra',   role: { pt: 'Cofundadora e Analista',       es: 'Cofundadora y Analista'        } },
]
