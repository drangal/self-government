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
import PinCodeInput from './Pincode'
import { useMutation } from 'react-query'

const BASE_URL = 'http://79.174.80.94:8000/auth/'

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

async function postRegistration(formData) {
  const { data } = await authApi.post('registration', formData)
  return data.user
}

const RegistrationForm = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('access_token')) navigate('/')
  }, [])

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    patronymic: '',
    email: '',
    role: 'controller'
  })
  const [confrim, setConfrim] = useState(false)

  const registerUser = useMutation(postRegistration, {
    onSuccess: () => {
      // Handle successful registration (e.g., redirect to login)
      console.log('Registration successful!')
      setConfrim(true)
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    }
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await registerUser.mutate(formData)
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
            method={'registration'}
            email={formData.email}
            code={'111111'}
            setConfrim={setConfrim}
          />
        ) : (
          <Stack direction='column' spacing={3}>
            <Typography variant='h4' color={'#1976d2'}>
              Регистрация
            </Typography>
            <TextField
              required
              label='Введите фамилию'
              name='last_name'
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              required
              label='Введите имя'
              name='first_name'
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              required
              label='Введите отчество'
              name='patronymic'
              value={formData.patronymic}
              onChange={handleChange}
            />
            <TextField
              required
              label='Введите номер телефона'
              name='email'
              value={formData.email}
              onChange={handleChange}
              error={registerUser.error}
              autoComplete='off'
            />
            <Button
              type='submit'
              variant='contained'
              disabled={registerUser.isLoading}
            >
              {registerUser.isLoading ? (
                <CircularProgress sx={{ mt: 2 }} />
              ) : (
                'Зарегистрироваться'
              )}
            </Button>

            <Typography>
              У вас уже есть аккаунт?&nbsp;
              <NavLink to='/login'>Войти</NavLink>
            </Typography>
          </Stack>
        )}
      </Paper>
    </Box>
  )
}

export default RegistrationForm
