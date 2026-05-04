import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingsPage from './pages/ListingsPage'
import NewAdPage from './pages/NewAdPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"             element={<Home />} />
      <Route path="/anuncios/:category" element={<ListingsPage />} />
      <Route path="/novo-anuncio" element={<NewAdPage />} />
      <Route path="/entrar"       element={<LoginPage />} />
      <Route path="/cadastro"     element={<RegisterPage />} />
    </Routes>
  )
}
