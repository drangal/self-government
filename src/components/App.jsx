import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './Аuthentication/LoginForm'
import RegistrationForm from './Аuthentication/RegistrationForm'
import { MainPage } from './MainPage'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/registration' element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  )
}
