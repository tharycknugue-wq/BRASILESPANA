import { useState } from 'react'
import { Heart, Globe, Users, Target } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { TEAM, CONTACT } from '../lib/social'

const TEXT = {
  pt: {
    title: 'Sobre o BRASILESPAÑA',
    subtitle: 'Primeiro produto do ecossistema CONEXÃO BR',
    missionTitle: 'Nossa missão',
    mission: 'Conectar, fortalecer e valorizar a comunidade brasileira da diáspora — criando pertencimento, oportunidade e apoio mútuo entre brasileiros que vivem fora do Brasil.',
    statsTitle: 'A diáspora em números',
    stats: [
      { value: '162.000', label: 'Brasileiros na Espanha' },
      { value: '4.996.951', label: 'Brasileiros no exterior' },
      { value: '35', label: 'Países do ecossistema' },
    ],
    visionTitle: 'O ecossistema CONEXÃO BR',
    vision: 'BRASILESPAÑA é a primeira de 35 plataformas planejadas para Américas, Europa, Ásia, África, Oceania e Oriente Médio. Em cada país, conectamos brasileiros a serviços, produtos, vagas, doações e voluntariado — sempre em português e no idioma local.',
    teamTitle: 'Equipe fundadora',
    valuesTitle: 'O que nos move',
    values: [
      { icon: Heart, title: 'Comunidade', desc: 'Pertencimento e apoio mútuo entre brasileiros' },
      { icon: Globe, title: 'Bilíngue',   desc: 'Português + idioma local em cada país' },
      { icon: Users, title: 'Inclusivo',  desc: 'Espaço para empreendedores, profissionais e voluntários' },
      { icon: Target, title: 'Foco',      desc: 'Resolver problemas reais do dia a dia da diáspora' },
    ],
    contact: 'Fale com a gente',
  },
  es: {
    title: 'Sobre BRASILESPAÑA',
    subtitle: 'Primer producto del ecosistema CONEXÃO BR',
    missionTitle: 'Nuestra misión',
    mission: 'Conectar, fortalecer y valorar a la comunidad brasileña de la diáspora — creando pertenencia, oportunidad y apoyo mutuo entre brasileños que viven fuera de Brasil.',
    statsTitle: 'La diáspora en números',
    stats: [
      { value: '162.000', label: 'Brasileños en España' },
      { value: '4.996.951', label: 'Brasileños en el exterior' },
      { value: '35', label: 'Países del ecosistema' },
    ],
    visionTitle: 'El ecosistema CONEXÃO BR',
    vision: 'BRASILESPAÑA es la primera de 35 plataformas planeadas para las Américas, Europa, Asia, África, Oceanía y Oriente Medio. En cada país, conectamos brasileños a servicios, productos, empleos, donaciones y voluntariado — siempre en portugués y en el idioma local.',
    teamTitle: 'Equipo fundador',
    valuesTitle: 'Lo que nos mueve',
    values: [
      { icon: Heart, title: 'Comunidad', desc: 'Pertenencia y apoyo mutuo entre brasileños' },
      { icon: Globe, title: 'Bilingüe',  desc: 'Portugués + idioma local en cada país' },
      { icon: Users, title: 'Inclusivo', desc: 'Espacio para emprendedores, profesionales y voluntarios' },
      { icon: Target, title: 'Foco',     desc: 'Resolver problemas reales del día a día de la diáspora' },
    ],
    contact: 'Habla con nosotros',
  },
}

export default function SobrePage() {
  const [lang] = useState('pt')
  const t = TEXT[lang]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader lang={lang} backTo="/" />

      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm">{t.subtitle}</p>
        </div>

        {/* Missão */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-black mb-3" style={{ color: '#1A7A2E' }}>{t.missionTitle}</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{t.mission}</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3 mb-6">
          {t.stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl font-black" style={{ color: '#1A7A2E' }}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Visão */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-black mb-3" style={{ color: '#1A7A2E' }}>{t.visionTitle}</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{t.vision}</p>
        </section>

        {/* Valores */}
        <section className="mb-6">
          <h2 className="text-lg font-black text-gray-900 mb-4 px-2">{t.valuesTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.values.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: '#E8F5E9' }}>
                    <Icon size={18} style={{ color: '#1A7A2E' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-0.5">{v.title}</h3>
                    <p className="text-xs text-gray-500 leading-snug">{v.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Equipe */}
        <section className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-black mb-4" style={{ color: '#1A7A2E' }}>{t.teamTitle}</h2>
          <ul className="space-y-3">
            {TEAM.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                     style={{ background: '#1A7A2E' }}>
                  {m.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.role[lang]}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Contato */}
        <section className="text-center mb-4">
          <a href={`mailto:${CONTACT.email}`}
             className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm"
             style={{ background: '#1A7A2E' }}>
            {t.contact} → {CONTACT.email}
          </a>
        </section>
      </main>
    </div>
  )
}
