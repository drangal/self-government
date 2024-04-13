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
import { ChevronLeft, ChevronRight, Search } from '@mui/icons-material'
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import axios from 'axios'
import { useQuery } from 'react-query'
import PieActiveArc from './PieChart'
import ComplaintsChart from './LineChart'
import { ComplaintsTable } from './Tablet'

const BASE_URL = 'http://172.16.0.151:8011/applications/'

export const applicationsApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false
})

applicationsApi.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`
}

async function getAllApplications(offset) {
  const { data } = await applicationsApi.get(`getAll?limit=6&offset=${offset}`)
  return data.applications
}

export const MainPage = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useQuery(
    ['applications', page],
    () => getAllApplications((page - 1) * 6),
    { keepPreviousData: true }
  )

  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [statuses, setStatuses] = useState('')
  const [tab, setTab] = useState()

  useEffect(() => {
    if (!localStorage.getItem('access_token')) navigate('/login')
  }, [])

  const handleClickApplicationTab = () => {
    setTab()
  }

  const handleClickStatisticTab = () => {
    setTab('stat')
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
          'linear-gradient(348deg, rgba(238,174,202,1) 0%, rgba(202,179,214,1) 14%, rgba(148,187,233,1) 100%)',
        minHeight: '100dvh'
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
        <Toolbar sx={{ display: 'flex' }}>
          <Stack direction='row' alignItems='center'>
            <Button
              onClick={handleClickApplicationTab}
              variant='outlined'
              color='primary'
              sx={{ mr: 2 }}
            >
              Заявки
            </Button>
            <Button
              onClick={handleClickStatisticTab}
              variant='outlined'
              color='secondary'
            >
              Статистика
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth='lg'
        sx={{
          mt: { xs: 1, sm: 2, md: 4 },
          display: tab && 'none'
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
        {statuses === '' && (
          <Stack direction='row' spacing={2} alignItems='center'>
            <IconButton
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data?.length !== 6}
            >
              <ChevronRight />
            </IconButton>
          </Stack>
        )}
      </Container>
      <Container
        maxWidth='lg'
        sx={{
          mt: { xs: 1, sm: 2, md: 4 },
          display: tab || 'none'
        }}
      >
        <Box direction='column' alignItems={'center'}>
          <Box textAlign={'center'}>
            <Typography>Жалобы по торговым точкам</Typography>
            <PieActiveArc
              data={[
                { id: 0, value: 10, label: 'Магазин 1' },
                { id: 1, value: 15, label: 'Магазин 2' },
                { id: 2, value: 20, label: 'Магазин 3' },
                { id: 3, value: 2, label: 'Магазин 4' },
                { id: 4, value: 8, label: 'Магазин 5' },
                { id: 5, value: 1, label: 'Магазин 6' },
                { id: 6, value: 30, label: 'Магазин 7' },
                { id: 7, value: 30, label: 'Другие' }
              ]}
            />
          </Box>
          <Box textAlign={'center'}>
            <Typography>Жалобы по товарам</Typography>
            <PieActiveArc
              data={[
                { id: 0, value: 1, label: 'Товар 1' },
                { id: 1, value: 15, label: 'Товар 2' },
                { id: 2, value: 8, label: 'Товар 3' },
                { id: 3, value: 2, label: 'Товар 4' },
                { id: 4, value: 8, label: 'Товар 5' },
                { id: 5, value: 10, label: 'Товар 6' },
                { id: 6, value: 30, label: 'Товар 7' },
                { id: 7, value: 1, label: 'Другие' }
              ]}
            />
          </Box>
          <ComplaintsChart />
          <ComplaintsTable />
        </Box>
      </Container>
    </Box>
  )
}
