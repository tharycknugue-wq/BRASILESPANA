import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, CreditCard, FileCheck2, Briefcase,
  Upload, CheckCircle, AlertTriangle, ShieldCheck, X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { useLang } from '../lib/lang'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { sanitize } from '../lib/security'

const TEXT = {
  pt: {
    back: 'Voltar',
    title: 'Verificação de Anunciante',
    subtitle: 'Para publicar anúncios, confirme sua identidade. Seus documentos são privados e usados apenas para verificação.',
    steps: ['Endereço', 'Nacionalidade', 'Identidade', 'Padrón', 'Revisar'],
    loginRequired: 'Você precisa entrar para concluir a verificação.',
    goLogin: 'Ir para Entrar',
    onlyAdvertiser: 'A verificação é só para contas Anunciante.',
    alreadyPending: 'Sua verificação já foi enviada e está em análise.',
    alreadyVerified: 'Sua conta já está verificada. Você pode publicar anúncios.',
    goPanel: 'Ir para o painel',
    // endereço
    addrTitle: 'Onde você mora na Espanha?',
    address: 'Endereço (rua e número)',
    addressPh: 'Calle Mayor, 12, 3º B',
    postal: 'Código postal',
    postalPh: '28013',
    city: 'Cidade',
    cityPh: 'Madrid',
    province: 'Província',
    provincePh: 'Madrid',
    // nacionalidade
    natTitle: 'Sua situação',
    natLabel: 'Nacionalidade',
    natBR: 'Brasileiro(a)',
    natDual: 'Brasileiro(a) com dupla nacionalidade',
    autonomoLabel: 'Você é autônomo(a) (autónomo)?',
    yes: 'Sim',
    no: 'Não',
    // identidade
    idTitle: 'Documento de identidade',
    idType: 'Tipo de documento',
    tie: 'TIE',
    nie: 'NIE',
    dni: 'DNI',
    passport: 'Passaporte',
    front: 'Frente',
    backSide: 'Verso',
    altaTitle: 'Alta de Autónomo',
    altaDesc: 'Como você marcou que é autônomo(a), anexe o comprovante de Alta de Autónomo.',
    // padrón
    padronTitle: 'Empadronamiento (Padrón)',
    padronDesc: 'Anexe o seu certificado de empadronamiento.',
    fileHint: 'JPG, PNG ou PDF · até 5 MB',
    chooseFile: 'Escolher arquivo',
    remove: 'Remover',
    // revisar
    reviewTitle: 'Revisar e enviar',
    reviewIntro: 'Confira os dados. Após o envio, a análise leva até 48h úteis.',
    submit: 'Enviar para verificação',
    sending: 'Enviando...',
    next: 'Continuar',
    sentTitle: 'Documentos enviados!',
    sentDesc: 'Recebemos seus documentos. Avisaremos por e-mail quando a verificação for concluída (até 48h úteis).',
    legal: 'Declaro que as informações e documentos são verdadeiros. Informações falsas são de minha total responsabilidade, respondendo às ações jurídicas, penais e civis cabíveis.',
    errRequired: 'Campo obrigatório',
    errFile: 'Anexe este documento',
    errLegal: 'Você precisa aceitar a declaração',
    errUpload: 'Falha ao enviar os arquivos. Tente novamente.',
  },
  es: {
    back: 'Volver',
    title: 'Verificación de Anunciante',
    subtitle: 'Para publicar anuncios, confirma tu identidad. Tus documentos son privados y se usan solo para la verificación.',
    steps: ['Dirección', 'Nacionalidad', 'Identidad', 'Padrón', 'Revisar'],
    loginRequired: 'Tienes que iniciar sesión para completar la verificación.',
    goLogin: 'Ir a Entrar',
    onlyAdvertiser: 'La verificación es solo para cuentas Anunciante.',
    alreadyPending: 'Tu verificación ya fue enviada y está en análisis.',
    alreadyVerified: 'Tu cuenta ya está verificada. Puedes publicar anuncios.',
    goPanel: 'Ir al panel',
    addrTitle: '¿Dónde vives en España?',
    address: 'Dirección (calle y número)',
    addressPh: 'Calle Mayor, 12, 3º B',
    postal: 'Código postal',
    postalPh: '28013',
    city: 'Ciudad',
    cityPh: 'Madrid',
    province: 'Provincia',
    provincePh: 'Madrid',
    natTitle: 'Tu situación',
    natLabel: 'Nacionalidad',
    natBR: 'Brasileño(a)',
    natDual: 'Brasileño(a) con doble nacionalidad',
    autonomoLabel: '¿Eres autónomo(a)?',
    yes: 'Sí',
    no: 'No',
    idTitle: 'Documento de identidad',
    idType: 'Tipo de documento',
    tie: 'TIE',
    nie: 'NIE',
    dni: 'DNI',
    passport: 'Pasaporte',
    front: 'Anverso',
    backSide: 'Reverso',
    altaTitle: 'Alta de Autónomo',
    altaDesc: 'Como has indicado que eres autónomo(a), adjunta el justificante de Alta de Autónomo.',
    padronTitle: 'Empadronamiento (Padrón)',
    padronDesc: 'Adjunta tu certificado de empadronamiento.',
    fileHint: 'JPG, PNG o PDF · hasta 5 MB',
    chooseFile: 'Elegir archivo',
    remove: 'Quitar',
    reviewTitle: 'Revisar y enviar',
    reviewIntro: 'Comprueba los datos. Tras el envío, el análisis tarda hasta 48h hábiles.',
    submit: 'Enviar para verificación',
    sending: 'Enviando...',
    next: 'Continuar',
    sentTitle: '¡Documentos enviados!',
    sentDesc: 'Hemos recibido tus documentos. Te avisaremos por e-mail cuando la verificación esté completa (hasta 48h hábiles).',
    legal: 'Declaro que la información y los documentos son verdaderos. La información falsa es de mi total responsabilidad, respondiendo a las acciones jurídicas, penales y civiles correspondientes.',
    errRequired: 'Campo obligatorio',
    errFile: 'Adjunta este documento',
    errLegal: 'Debes aceptar la declaración',
    errUpload: 'Error al enviar los archivos. Inténtalo de nuevo.',
  },
}

const MAX_BYTES = 5 * 1024 * 1024

function FileSlot({ label, file, onPick, onClear, hint, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {file ? (
        <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-green-300 bg-green-50">
          <span className="flex items-center gap-2 text-sm text-green-800 truncate">
            <FileCheck2 size={16} className="flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </span>
          <button type="button" onClick={onClear}
            className="text-gray-400 hover:text-red-500 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center gap-1 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-brand-green'}`}>
          <Upload size={20} className="text-gray-400" />
          <span className="text-sm text-gray-500">{hint}</span>
          <input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f) }} />
        </label>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function VerificacaoAnunciantePage() {
  const { lang } = useLang()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const t = TEXT[lang]

  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    address: '', postal_code: '', city: '', province: '',
    nationality: '', is_autonomo: false,
    idType: 'tie',
  })
  const [files, setFiles] = useState({
    idFront: null, idBack: null, padron: null, alta: null,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !supabase) { setLoadingProfile(false); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (cancelled) return
      setProfile(data || null)
      if (data) {
        setForm(f => ({
          ...f,
          address: data.address || '', postal_code: data.postal_code || '',
          city: data.city || '', province: data.province || '',
          nationality: data.nationality || '', is_autonomo: !!data.is_autonomo,
        }))
      }
      setLoadingProfile(false)
    }
    if (!authLoading) load()
    return () => { cancelled = true }
  }, [user, authLoading])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: typeof v === 'string' ? sanitize(v) : v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }
  const pick = (slot, file) => {
    if (file.size > MAX_BYTES) { setErrors(e => ({ ...e, [slot]: t.fileHint })); return }
    setFiles(s => ({ ...s, [slot]: file }))
    setErrors(e => ({ ...e, [slot]: '' }))
  }
  const clearFile = (slot) => setFiles(s => ({ ...s, [slot]: null }))

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.address.trim())     e.address = t.errRequired
      if (!form.postal_code.trim()) e.postal_code = t.errRequired
      if (!form.city.trim())        e.city = t.errRequired
      if (!form.province.trim())    e.province = t.errRequired
    }
    if (s === 1) {
      if (!form.nationality) e.nationality = t.errRequired
    }
    if (s === 2) {
      if (!files.idFront) e.idFront = t.errFile
      if (!files.idBack)  e.idBack = t.errFile
      if (form.is_autonomo && !files.alta) e.alta = t.errFile
    }
    if (s === 3) {
      if (!files.padron) e.padron = t.errFile
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validateStep(step)) setStep(s => s + 1) }
  const goBack = () => (step === 0 ? navigate(-1) : setStep(s => s - 1))

  const [legalOk, setLegalOk] = useState(false)

  const uploadOne = async (file, name) => {
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const path = `${user.id}/${name}.${ext}`
    const { error } = await supabase.storage.from('kyc').upload(path, file, { upsert: true })
    if (error) throw error
    return path
  }

  const handleSubmit = async () => {
    if (!legalOk) { setErrors(e => ({ ...e, legal: t.errLegal })); return }
    if (!validateStep(2) || !validateStep(3)) { setStep(2); return }
    setSending(true); setServerError('')
    try {
      if (supabase) {
        const idFrontPath = await uploadOne(files.idFront, `${form.idType}-front`)
        const idBackPath  = await uploadOne(files.idBack,  `${form.idType}-back`)
        const padronPath  = await uploadOne(files.padron,  'padron-front')
        let altaPath = null
        if (form.is_autonomo && files.alta) altaPath = await uploadOne(files.alta, 'alta_autonomo-front')

        const rows = [
          { user_id: user.id, type: form.idType, front_path: idFrontPath, back_path: idBackPath },
          { user_id: user.id, type: 'padron',    front_path: padronPath,  back_path: null },
        ]
        if (altaPath) rows.push({ user_id: user.id, type: 'alta_autonomo', front_path: altaPath, back_path: null })

        const { error: dErr } = await supabase.from('documents').upsert(rows, { onConflict: 'user_id,type' })
        if (dErr) throw dErr

        const { error: pErr } = await supabase.from('profiles').update({
          address: form.address, postal_code: form.postal_code,
          city: form.city, province: form.province,
          nationality: form.nationality, is_autonomo: form.is_autonomo,
          kyc_status: 'pending',
        }).eq('id', user.id)
        if (pErr) throw pErr
      } else {
        await new Promise(r => setTimeout(r, 1000))
      }
      setSent(true)
    } catch {
      setServerError(t.errUpload)
    } finally {
      setSending(false)
    }
  }

  /* ── Gates ── */
  const Shell = ({ children }) => (
    <div className="min-h-screen flex flex-col" style={{ background: '#EBF5FB' }}>
      <PageHeader backTo="/painel" />
      <div className="flex w-full h-2">
        <div className="flex-1" style={{ background: '#1A7A2E' }} />
        <div className="flex-1" style={{ background: '#F5C800' }} />
        <div className="flex-1" style={{ background: '#CC1714' }} />
      </div>
      {children}
      <Footer />
    </div>
  )

  if (authLoading || loadingProfile) {
    return <Shell><main className="flex-1 flex items-center justify-center text-gray-500 text-sm">…</main></Shell>
  }
  if (!user) {
    return (
      <Shell><main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <p className="text-gray-700 font-semibold mb-4">{t.loginRequired}</p>
          <button onClick={() => navigate('/entrar')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goLogin}</button>
        </div>
      </main></Shell>
    )
  }
  if (profile && profile.account_type !== 'advertiser') {
    return (
      <Shell><main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <p className="text-gray-700 font-semibold mb-4">{t.onlyAdvertiser}</p>
          <button onClick={() => navigate('/painel')} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goPanel}</button>
        </div>
      </main></Shell>
    )
  }
  if (sent || profile?.kyc_status === 'pending' || profile?.kyc_status === 'verified') {
    const verified = profile?.kyc_status === 'verified'
    return (
      <Shell><main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#E8F5E9' }}>
            {verified ? <ShieldCheck size={38} style={{ color: '#1A7A2E' }} /> : <CheckCircle size={38} style={{ color: '#1A7A2E' }} />}
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {verified ? t.alreadyVerified : (sent ? t.sentTitle : t.alreadyPending)}
          </h2>
          {!verified && <p className="text-gray-500 text-sm mb-8">{t.sentDesc}</p>}
          <button onClick={() => navigate('/painel')} className="w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: '#1A7A2E' }}>{t.goPanel}</button>
        </div>
      </main></Shell>
    )
  }

  const inputCls = (k) => `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
    ${errors[k] ? 'border-red-400 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-brand-green focus:ring-green-100'}`

  return (
    <Shell>
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8">
        <button onClick={goBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-green mb-5">
          <ArrowLeft size={16} /> {t.back}
        </button>

        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck size={22} style={{ color: '#1A7A2E' }} />
          <h1 className="text-2xl font-black text-gray-900">{t.title}</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">{t.subtitle}</p>

        {/* Stepper */}
        <div className="flex items-center gap-1.5 mb-7">
          {t.steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${i < step ? 'bg-brand-green text-white' : i === step ? 'bg-brand-green text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < t.steps.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-brand-green' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {serverError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
            <AlertTriangle size={15} className="text-red-500" />
            <p className="text-xs text-red-600">{serverError}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-md">

          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><MapPin size={18} style={{ color: '#1A7A2E' }} /><h2 className="font-bold text-gray-800">{t.addrTitle}</h2></div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.address}</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder={t.addressPh} className={inputCls('address')} />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.postal}</label>
                  <input value={form.postal_code} onChange={e => set('postal_code', e.target.value)} placeholder={t.postalPh} className={inputCls('postal_code')} />
                  {errors.postal_code && <p className="text-xs text-red-500 mt-1">{errors.postal_code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.city}</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} className={inputCls('city')} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.province}</label>
                <input value={form.province} onChange={e => set('province', e.target.value)} placeholder={t.provincePh} className={inputCls('province')} />
                {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
              </div>
              <button onClick={goNext} className="btn-primary w-full">{t.next}</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><CreditCard size={18} style={{ color: '#1A7A2E' }} /><h2 className="font-bold text-gray-800">{t.natTitle}</h2></div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.natLabel}</label>
                <div className="space-y-2">
                  {[['brazilian', t.natBR], ['brazilian_dual', t.natDual]].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => set('nationality', val)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                        ${form.nationality === val ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-700 hover:border-brand-green'}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {errors.nationality && <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.autonomoLabel}</label>
                <div className="flex gap-2">
                  {[[true, t.yes], [false, t.no]].map(([val, label]) => (
                    <button key={String(val)} type="button" onClick={() => set('is_autonomo', val)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                        ${form.is_autonomo === val ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-700 hover:border-brand-green'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={goNext} className="btn-primary w-full">{t.next}</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><CreditCard size={18} style={{ color: '#1A7A2E' }} /><h2 className="font-bold text-gray-800">{t.idTitle}</h2></div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.idType}</label>
                <div className="grid grid-cols-4 gap-2">
                  {[['tie', t.tie], ['nie', t.nie], ['dni', t.dni], ['passport', t.passport]].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => set('idType', val)}
                      className={`px-2 py-2.5 rounded-xl border-2 text-xs font-bold transition-all
                        ${form.idType === val ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-700 hover:border-brand-green'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <FileSlot label={`${t.idType ? '' : ''}${t.front}`} file={files.idFront}
                hint={t.fileHint} error={errors.idFront}
                onPick={(f) => pick('idFront', f)} onClear={() => clearFile('idFront')} />
              <FileSlot label={t.backSide} file={files.idBack}
                hint={t.fileHint} error={errors.idBack}
                onPick={(f) => pick('idBack', f)} onClear={() => clearFile('idBack')} />

              {form.is_autonomo && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-1 mt-2"><Briefcase size={16} style={{ color: '#1A7A2E' }} /><h3 className="font-bold text-gray-800 text-sm">{t.altaTitle}</h3></div>
                  <p className="text-xs text-gray-500 mb-2">{t.altaDesc}</p>
                  <FileSlot label={t.altaTitle} file={files.alta}
                    hint={t.fileHint} error={errors.alta}
                    onPick={(f) => pick('alta', f)} onClear={() => clearFile('alta')} />
                </div>
              )}
              <button onClick={goNext} className="btn-primary w-full">{t.next}</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><FileCheck2 size={18} style={{ color: '#1A7A2E' }} /><h2 className="font-bold text-gray-800">{t.padronTitle}</h2></div>
              <p className="text-xs text-gray-500">{t.padronDesc}</p>
              <FileSlot label={t.padronTitle} file={files.padron}
                hint={t.fileHint} error={errors.padron}
                onPick={(f) => pick('padron', f)} onClear={() => clearFile('padron')} />
              <button onClick={goNext} className="btn-primary w-full">{t.next}</button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle size={18} style={{ color: '#1A7A2E' }} /><h2 className="font-bold text-gray-800">{t.reviewTitle}</h2></div>
              <p className="text-xs text-gray-500">{t.reviewIntro}</p>
              <ul className="text-sm space-y-2 border border-gray-100 rounded-xl p-4">
                <li className="flex justify-between gap-2"><span className="text-gray-400">{t.address}</span><span className="font-semibold text-gray-800 text-right">{[form.address, form.postal_code, form.city, form.province].filter(Boolean).join(', ')}</span></li>
                <li className="flex justify-between gap-2"><span className="text-gray-400">{t.natLabel}</span><span className="font-semibold text-gray-800">{form.nationality === 'brazilian_dual' ? t.natDual : t.natBR}</span></li>
                <li className="flex justify-between gap-2"><span className="text-gray-400">{t.idType}</span><span className="font-semibold text-gray-800 uppercase">{form.idType}</span></li>
                <li className="flex justify-between gap-2"><span className="text-gray-400">{t.autonomoLabel}</span><span className="font-semibold text-gray-800">{form.is_autonomo ? t.yes : t.no}</span></li>
              </ul>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={legalOk}
                  onChange={(e) => { setLegalOk(e.target.checked); setErrors(er => ({ ...er, legal: '' })) }}
                  className="mt-1 w-4 h-4 accent-green-700" />
                <span className="text-xs text-gray-600 leading-snug">{t.legal}</span>
              </label>
              {errors.legal && <p className="text-xs text-red-500">{errors.legal}</p>}

              <button onClick={handleSubmit} disabled={sending}
                className="btn-primary w-full disabled:opacity-60">
                {sending ? t.sending : t.submit}
              </button>
            </div>
          )}
        </div>
      </main>
    </Shell>
  )
}
