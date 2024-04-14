import {
  AppBar,
  Box,
  Button,
  CircularProgress,
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

async function getAllApplicationsByOffset(offset) {
  const { data } = await applicationsApi.get(`getAll?limit=6&offset=${offset}`)
  return data.applications
}

async function getAllApplicationsForShops() {
  const { data } = await applicationsApi.get(`getAll?limit=1000&offset=0`)
  const shopComplaintCounts = []

  for (const product of data.applications) {
    if (product.status === 0) {
      const shopName = product.shop.name
      const shopId = product.shop.id

      const existingShopCountObject = shopComplaintCounts.find(
        (obj) => obj.id === shopId
      )

      if (!existingShopCountObject) {
        const newShopCountObject = {
          id: shopId,
          value: 1, // Initial complaint count
          label: shopName
        }
        shopComplaintCounts.push(newShopCountObject)
      } else {
        existingShopCountObject.value++
      }
    }
  }
  return shopComplaintCounts
}

async function getAllApplicationsForProducts() {
  const { data } = await applicationsApi.get(`getAll?limit=100&offset=0`)
  const productComplaintCounts = []

  for (const product of data.applications) {
    if (product.status === 0) {
      const productName = product.name_product
      const applicationId = product.id

      const existingProductCountObject = productComplaintCounts.find(
        (obj) => obj.name === productName
      )

      if (!existingProductCountObject) {
        const newShopCountObject = {
          id: applicationId,
          value: 1, // Initial complaint count
          label: productName
        }
        productComplaintCounts.push(newShopCountObject)
      } else {
        existingProductCountObject.value++
      }
    }
  }
  return productComplaintCounts
}

/*async function getAllApplicationsForDates() {
  const { data } = await applicationsApi.get(`getAll?limit=100&offset=0`)
  const monthlyComplaintCounts = []

  for (const product of data.applications) {
    if (product.status === -1) {
      const productDate = new Date(product.created_at)
      const month = productDate.getMonth() // 0-indexed month
      const year = productDate.getFullYear()

      const existingMonthlyCountObject = monthlyComplaintCounts.find(
        (obj) =>
          obj.date.getMonth() === month && obj.date.getFullYear() === year
      )

      if (!existingMonthlyCountObject) {
        const newMonthlyCountObject = {
          date: new Date(year, month, 1).toLocaleDateString('ru-RU'), // Set date to first day of the month
          complaints: 1
        }
        monthlyComplaintCounts.push(newMonthlyCountObject)
      } else {
        existingMonthlyCountObject.complaints++
      }
    }
  }
  console.log(monthlyComplaintCounts)
  return monthlyComplaintCounts
}*/

export const MainPage = () => {
  const [page, setPage] = useState(1)
  const AllApplicationsByOffset = useQuery(
    ['applications', page],
    () => getAllApplicationsByOffset((page - 1) * 6),
    {
      keepPreviousData: true,
      refetchInterval: 10000, // Refetch data every 5 seconds (optional)
      refetchOnMount: true, // Refetch on initial mount
      refetchOnWindowFocus: true, // Refetch when window regains focus (optional)
      refetchOnReconnect: true // Refetch when network connection is restored (optional)
    }
  )
  const allApplicationsForShops = useQuery(
    ['applicationsForShops'],
    () => getAllApplicationsForShops(),
    {
      keepPreviousData: true,
      refetchInterval: 10000, // Refetch data every 5 seconds (optional)
      refetchOnMount: true, // Refetch on initial mount
      refetchOnWindowFocus: true, // Refetch when window regains focus (optional)
      refetchOnReconnect: true // Refetch when network connection is restored (optional)
    }
  )
  const allApplicationsForProducts = useQuery(
    ['applicationsForProducts'],
    () => getAllApplicationsForProducts(),
    {
      keepPreviousData: true,
      refetchInterval: 10000, // Refetch data every 5 seconds (optional)
      refetchOnMount: true, // Refetch on initial mount
      refetchOnWindowFocus: true, // Refetch when window regains focus (optional)
      refetchOnReconnect: true // Refetch when network connection is restored (optional)
    }
  )
  /*const allApplicationsForDates = useQuery(
    ['applicationsForDates'],
    () => getAllApplicationsForDates(),
    {
      keepPreviousData: true,
      refetchInterval: 10000, // Refetch data every 5 seconds (optional)
      refetchOnMount: true, // Refetch on initial mount
      refetchOnWindowFocus: true, // Refetch when window regains focus (optional)
      refetchOnReconnect: true // Refetch when network connection is restored (optional)
    }
  )*/

  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(AllApplicationsByOffset.data)
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
    const filtered = AllApplicationsByOffset.data?.filter(
      (item) =>
        (item.category.toLowerCase().includes(searchText) ||
          item.name_product.toLowerCase().includes(searchText) ||
          item.shop.name.toLowerCase().includes(searchText)) &&
        `${item.status}`.includes(statuses)
    )
    setFilteredData(filtered)
    if (AllApplicationsByOffset.data?.length === 0)
      setPage((prev) => Math.max(1, prev - 1))
  }, [
    AllApplicationsByOffset.data,
    allApplicationsForShops.data,
    allApplicationsForProducts.data,
    searchText,
    statuses
  ])

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
            <ToggleButton value='1' aria-label='good'>
              <AssignmentTurnedInIcon />
            </ToggleButton>
            <ToggleButton value='-1' aria-label='bad'>
              <AssignmentLateIcon />
            </ToggleButton>
            <ToggleButton value='0' aria-label='corrected'>
              <DriveFileRenameOutlineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {AllApplicationsByOffset.isLoading ? (
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
            <Typography variant='body2'>{page}</Typography>
            <IconButton
              onClick={() => setPage((prev) => prev + 1)}
              disabled={AllApplicationsByOffset.data?.length !== 6}
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
            <Typography>
              Кол-во &quot;неудачных&quot; заявок по магазинам
            </Typography>
            {allApplicationsForShops.isLoading ? (
              <CircularProgress />
            ) : (
              <PieActiveArc data={allApplicationsForShops.data} />
            )}
          </Box>
          <Box textAlign={'center'}>
            <Typography>
              Кол-во &quot;неудачных&quot; заявок по товарам
            </Typography>
            {allApplicationsForProducts.isLoading ? (
              <CircularProgress />
            ) : (
              <PieActiveArc data={allApplicationsForProducts.data} />
            )}
          </Box>
          {/*   const data = [
    { date: new Date('2023-01-01'), complaints: 10 }, // Replace with your actual data
    { date: new Date('2023-02-01'), complaints: 15 },
    { date: new Date('2023-03-01'), complaints: 22 },
    { date: new Date('2023-04-01'), complaints: 2 },
    { date: new Date('2023-05-01'), complaints: 30 },
    { date: new Date('2023-06-01'), complaints: 2 },
    { date: new Date('2023-07-01'), complaints: 5 }
  ] */}
          {/* {allApplicationsForDates.isLoading ? (
            <CircularProgress />
          ) : (
            <ComplaintsChart data={allApplicationsForDates.data} />
          )} */}
          <ComplaintsChart />
          <ComplaintsTable />
        </Box>
      </Container>
    </Box>
  )
}
