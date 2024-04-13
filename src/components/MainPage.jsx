import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Pagination,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { ApplicationCard } from './ApplicationCard'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from '@mui/icons-material'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import axios from 'axios'
import { useQuery } from 'react-query'

const BASE_URL =
  'https://6c3556cd2312afd6be3e3133b35830e3.serveo.net/applications/'

export const applicationsApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

applicationsApi.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`
}

async function getAllApplications(offset) {
  const { data } = await applicationsApi.get(`getAll?limit=10&offset=${offset}`)
  return data.applications
}

export const MainPage = () => {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useQuery(
    ['applications', page],
    () => getAllApplications(page * 10),
    { keepPreviousData: true }
  )

  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [statuses, setStatuses] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('access_token')) navigate('/login')
  }, [])

  const handlePaginationChange = (event, value) => {
    setPage(value)
  }

  const handleChange = (event) => {
    setSearchText(event.target.value.toLowerCase())
  }

  const handleStatus = (event, newStatus) => {
    if (newStatus !== null) {
      setStatuses(newStatus)
    }
  }

  useEffect(() => {
    const filtered = data?.filter(
      (item) =>
        (item.category.toLowerCase().includes(searchText) ||
          item.name_product.toLowerCase().includes(searchText) ||
          item.shop.name.toLowerCase().includes(searchText)) &&
        `${item.status}`.includes(statuses)
    )
    setFilteredData(filtered)
  }, [data, searchText, statuses])

  return (
    <Box
      sx={{
        background:
          'linear-gradient(348deg, rgba(238,174,202,1) 0%, rgba(202,179,214,1) 14%, rgba(148,187,233,1) 100%)'
      }}
    >
      <AppBar
        position='static'
        sx={{
          background:
            'linear-gradient(9deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 36%, rgba(0,212,255,1) 100%)'
        }}
      >
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Контролируем цены вместе
          </Typography>
          <Tooltip title={localStorage.getItem('email')}>
            <Button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('email')
                navigate('/login')
              }}
              color='inherit'
              sx={{ fontFamily: 'Nunito' }}
            >
              <Divider orientation='vertical' flexItem sx={{ mr: 1 }} />
              Выйти
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth='lg'
        sx={{
          mt: { xs: 1, sm: 2, md: 4 }
        }}
      >
        <Stack
          direction={'column'}
          justifyContent='center'
          alignItems='center'
          mb={2}
        >
          <FormControl sx={{ width: '100%', maxWidth: 400 }}>
            <InputLabel htmlFor='search'>Поиск</InputLabel>
            <OutlinedInput
              id='search'
              value={searchText}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
              label='Поиск'
            />
          </FormControl>
          <ToggleButtonGroup
            value={statuses}
            exclusive
            onChange={handleStatus}
            aria-label='status'
          >
            <ToggleButton value='' aria-label='all'>
              <AutoAwesomeMotionIcon />
            </ToggleButton>
            <ToggleButton value='2' aria-label='good'>
              <AssignmentTurnedInIcon />
            </ToggleButton>
            <ToggleButton value='1' aria-label='bad'>
              <AssignmentLateIcon />
            </ToggleButton>
            <ToggleButton value='0' aria-label='corrected'>
              <DriveFileRenameOutlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {isLoading ? (
          <LinearProgress />
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap={'wrap'}
            spacing={4}
            useFlexGap
            justifyContent={'flex-start'}
            alignContent={'space-around'}
          >
            {filteredData?.map((item) => (
              <ApplicationCard key={item.id} {...item} />
            ))}
          </Stack>
        )}
        <Pagination
          count={Math.ceil(data?.lenght / 10) || 0}
          page={page}
          onChange={handlePaginationChange}
          variant='outlined'
          shape='rounded'
          sx={{ mt: 2 }}
        />
      </Container>
    </Box>
  )
}

// const data = [
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 1',
//     itemName: 'Товар 1',
//     price: 100,
//     maxPrice: 120,
//     status: 'В рассмотрении'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.pn',
//     storeName: 'Магазин 2',
//     itemName: 'Товар 1',
//     price: 130,
//     maxPrice: 120,
//     status: 'Отклонена'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   },
//   {
//     photo: 'https://tamali.net/forms/torg/cenniki/img/cennik60x65_barcode.png',
//     storeName: 'Магазин 3',
//     itemName: 'Товар 1',
//     price: 120,
//     maxPrice: 120,
//     status: 'Принята'
//   }
// ]
