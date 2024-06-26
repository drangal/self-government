import { useRef, useState } from 'react'
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useMutation } from 'react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'http://79.174.80.94:8000/auth/'

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

async function postRegistrationConfirm(confirm_info) {
  const { data } = await authApi.post('registration_confirm', confirm_info)
  return data.access_token
}

async function postAuthConfirm(confirm_info) {
  const { data } = await authApi.post('auth_check', confirm_info)
  return data.access_token
}

const saveJWT = (token) => {
  localStorage.setItem('access_token', token)
}
const saveEmail = (email) => {
  localStorage.setItem('email', email)
}

const PinCodeInput = ({ method, email, code, setConfrim }) => {
  const navigate = useNavigate()
  const [pinCode, setPinCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)

  const mutationRegisterConfirmUser = useMutation(postRegistrationConfirm, {
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: (data, variables, context) => {
      // Handle successful registration (e.g., redirect to login)
      console.log('Registration confirm successful!')
      saveJWT(data)
      saveEmail(email)
      navigate('/')
    }
  })
  const mutationAuthConfirmUser = useMutation(postAuthConfirm, {
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: (data, variables, context) => {
      // Handle successful login
      console.log('Registration confirm successful!')
      saveJWT(data)
      saveEmail(email)
      navigate('/')
    }
  })

  const inputRefs = Array(6)
    .fill(null)
    .map(() => useRef(null))

  const handleInputChange = (e, index) => {
    const updatedPinCode = [...pinCode]
    updatedPinCode[index] = e.target.value
    setPinCode(updatedPinCode)

    // Переход фокуса при вводе цифры
    if (
      e.key === 'ArrowRight' ||
      (e.key !== 'Backspace' && e.target.value.length === 1)
    ) {
      if (index < 5) {
        inputRefs[index + 1].current.focus()
      }
    }
    // Переход фокуса при стирании цифры
    if (
      e.key === 'ArrowLeft' ||
      (e.key === 'Backspace' && e.target.value.length === 0)
    ) {
      if (index > 0) {
        inputRefs[index - 1].current.focus()
      }
    }
  }

  const handleSubmit = () => {
    setError(false) // Сброс ошибки при повторном вводе
    console.log(
      'Это код сервера:' + code + '\nЭто код юзера' + pinCode.join('')
    )
    // Проверка пин-кода
    if (pinCode.join('') !== `${code}`) {
      setError(true)
    } else {
      if (method === 'registration')
        mutationRegisterConfirmUser.mutate({
          email: email,
          role: 'controller',
          code: +pinCode.join('')
        })
      else
        mutationAuthConfirmUser.mutate({
          email: email,
          role: 'controller',
          code: +pinCode.join('')
        })
    }
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        {pinCode.map((digit, index) => (
          <TextField
            key={index}
            inputProps={{ maxLength: 1, type: 'string' }}
            inputRef={inputRefs[index]}
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyUp={(e) => handleInputChange(e, index)}
            error={
              mutationAuthConfirmUser.isError ||
              mutationRegisterConfirmUser.isError ||
              (error && index < 6)
            }
            sx={{
              width: 40,
              height: 40,
              borderRadius: 4
            }}
          />
        ))}
      </Box>
      <Box mt={4}>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={
            mutationAuthConfirmUser.isLoading ||
            mutationRegisterConfirmUser.isLoading
          }
        >
          Проверить пин-код
        </Button>

        <IconButton
          onClick={() => setConfrim(false)}
          disabled={
            mutationAuthConfirmUser.isLoading ||
            mutationRegisterConfirmUser.isLoading
          }
        >
          <Tooltip title='Сменить почту'>
            <Close />
          </Tooltip>
        </IconButton>
      </Box>
      {(mutationAuthConfirmUser.isLoading ||
        mutationRegisterConfirmUser.isLoading) && (
        <CircularProgress sx={{ mt: 2 }} />
      )}
    </Box>
  )
}

export default PinCodeInput
