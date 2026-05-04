import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingsPage from './pages/ListingsPage'
import NewAdPage from './pages/NewAdPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SobrePage from './pages/SobrePage'
import ContatoPage from './pages/ContatoPage'
import ComoFuncionaPage from './pages/ComoFuncionaPage'
import PrivacidadePage from './pages/PrivacidadePage'
import TermosPage from './pages/TermosPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Home />} />
      <Route path="/anuncios/:category" element={<ListingsPage />} />
      <Route path="/novo-anuncio"       element={<NewAdPage />} />
      <Route path="/entrar"             element={<LoginPage />} />
      <Route path="/cadastro"           element={<RegisterPage />} />
      <Route path="/sobre"              element={<SobrePage />} />
      <Route path="/contato"            element={<ContatoPage />} />
      <Route path="/como-funciona"      element={<ComoFuncionaPage />} />
      <Route path="/privacidade"        element={<PrivacidadePage />} />
      <Route path="/termos"             element={<TermosPage />} />
    </Routes>
  )
}
