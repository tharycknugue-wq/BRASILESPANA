import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingsPage from './pages/ListingsPage'
import AnuncioDetalhePage from './pages/AnuncioDetalhePage'
import NewAdPage from './pages/NewAdPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EsqueciSenhaPage from './pages/EsqueciSenhaPage'
import PainelPage from './pages/PainelPage'
import ProfilePage from './pages/ProfilePage'
import BaixarAppPage from './pages/BaixarAppPage'
import VerificacaoAnunciantePage from './pages/VerificacaoAnunciantePage'
import EditarPerfilAnunciantePage from './pages/EditarPerfilAnunciantePage'
import AnunciantePublicoPage from './pages/AnunciantePublicoPage'
import AssinaturaPage from './pages/AssinaturaPage'
import SobrePage from './pages/SobrePage'
import ContatoPage from './pages/ContatoPage'
import ComoFuncionaPage from './pages/ComoFuncionaPage'
import PrivacidadePage from './pages/PrivacidadePage'
import TermosPage from './pages/TermosPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Home />} />
      <Route path="/anuncios/:category" element={<ListingsPage />} />
      <Route path="/anuncio/:id"        element={<AnuncioDetalhePage />} />
      <Route path="/novo-anuncio"       element={<NewAdPage />} />
      <Route path="/entrar"             element={<LoginPage />} />
      <Route path="/cadastro"           element={<RegisterPage />} />
      <Route path="/esqueci-senha"      element={<EsqueciSenhaPage />} />
      <Route path="/painel"             element={<PainelPage />} />
      <Route path="/perfil"             element={<ProfilePage />} />
      <Route path="/baixar-app"         element={<BaixarAppPage />} />
      <Route path="/anunciante/verificacao" element={<VerificacaoAnunciantePage />} />
      <Route path="/anunciante/perfil"      element={<EditarPerfilAnunciantePage />} />
      <Route path="/anunciante/:username"   element={<AnunciantePublicoPage />} />
      <Route path="/assinatura"         element={<AssinaturaPage />} />
      <Route path="/sobre"              element={<SobrePage />} />
      <Route path="/contato"            element={<ContatoPage />} />
      <Route path="/como-funciona"      element={<ComoFuncionaPage />} />
      <Route path="/privacidade"        element={<PrivacidadePage />} />
      <Route path="/termos"             element={<TermosPage />} />
      <Route path="*"                   element={<NotFoundPage />} />
    </Routes>
  )
}
