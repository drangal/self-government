import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import PinCodeInput from './Pincode'

const BASE_URL = 'http://79.174.80.94:8000/auth/'

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

async function postAuth(formData) {
  const { data } = await authApi.post('auth', formData)
  return data.user
}

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    role: 'controller'
  })
  const [confrim, setConfrim] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('access_token')) navigate('/')
  }, [])

  const {
    mutate: loginUser,
    data,
    isLoading,
    error
  } = useMutation(postAuth, {
    onSuccess: () => {
      // Handle successful login
      console.log('Login successful!')
      setConfrim(true)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await loginUser(formData)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh'
      }}
    >
      <Paper
        elevation={3}
        component='form'
        onSubmit={handleSubmit}
        sx={{ width: { xs: 'auto', md: '40dvw' }, paddingX: 4, paddingY: 7 }}
      >
        {confrim ? (
          <PinCodeInput
            method={'login'}
            email={formData.email}
            code={'111111'}
            setConfrim={setConfrim}
          />
        ) : (
          <Stack direction='column' spacing={3}>
            <Typography variant='h4' color={'#1976d2'}>
              Вход
            </Typography>
            <TextField
              required
              label='Введите номер телефона'
              name='email'
              value={formData.email}
              onChange={handleChange}
              error={error}
              autoComplete='off'
            />
            <Button type='submit' variant='contained' disabled={isLoading}>
              {isLoading ? <CircularProgress sx={{ mt: 2 }} /> : 'Войти'}
            </Button>
            <Typography>
              У вас ещё нет аккаунта?&nbsp;
              <NavLink to='/registration'>Зарегистрироваться</NavLink>
            </Typography>
          </Stack>
        )}
      </Paper>
    </Box>
  )
}

export default LoginForm
