import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardHeader
} from '@mui/material'
import axios from 'axios'
import { useQuery } from 'react-query'

async function getAddressByCoordinates(coordinates) {
  const { data } = await axios.get(
    `https://geocode-maps.yandex.ru/1.x/?apikey=7db33d24-f7c2-4da2-acb8-6ff0334592e7&geocode=${coordinates?.join(
      ', '
    )}&&results=1&format=json`
  )
  return data?.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text.replace(
    'Украина, ',
    ''
  )
}

export const ApplicationCard = ({
  photo,
  shop,
  category,
  name_product,
  status,
  price,
  max_price,
  created_at,
  coordinates
}) => {
  const { data, isLoading, isError } = useQuery(
    ['address'],
    () => getAddressByCoordinates(coordinates),
    { keepPreviousData: true }
  )

  return (
    <Card sx={{ maxWidth: 345, padding: 1 }}>
      <CardHeader
        title={category}
        subheader={new Date(created_at).toLocaleDateString('ru-RU')}
      />
      <CardMedia
        component='img'
        sx={{
          height: 200,
          objectFit: 'contain'
        }}
        image={photo}
        title={name_product}
        alt='Фото ценника.'
      />
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {name_product}
        </Typography>
        <Typography variant='body1' gutterBottom>
          {shop?.name}
        </Typography>
        <Typography variant='body1' gutterBottom>
          {data}
        </Typography>

        <Box>
          <Typography variant='body2' component='span'>
            Цена:
          </Typography>
          <Typography variant='body2' component='span' fontWeight='bold'>
            {price} ₽
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2' component='span'>
            Макс. цена:
          </Typography>
          <Typography variant='body2' component='span' fontWeight='bold'>
            {max_price} ₽
          </Typography>
        </Box>
        <Typography
          variant='body2'
          color={status === 0 ? 'orange' : status === -1 ? 'red' : 'green'}
        >
          {status === 0
            ? 'В рассмотрении'
            : status === -1
            ? 'Отклонена'
            : 'Принята'}
        </Typography>
      </CardContent>
    </Card>
  )
}
