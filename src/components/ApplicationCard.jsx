import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'

export const ApplicationCard = ({
  photo,
  storeName,
  itemName,
  price,
  maxPrice,
  status
}) => {
  return (
    <Card sx={{ maxWidth: 345, padding: 1 }}>
      <CardMedia
        component='img'
        sx={{
          height: 200,
          objectFit: 'contain'
        }}
        image={photo}
        title={itemName}
        alt='Фото ценника.'
      />
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {storeName}
        </Typography>
        <Typography variant='body1' gutterBottom>
          {itemName}
        </Typography>
        <Box>
          <Typography variant='body2' component='span'>
            Цена:
          </Typography>
          <Typography variant='body2' component='span' fontWeight='bold'>
            {price}
          </Typography>
        </Box>
        <Box>
          <Typography variant='body2' component='span'>
            Макс. цена:
          </Typography>
          <Typography variant='body2' component='span' fontWeight='bold'>
            {maxPrice}
          </Typography>
        </Box>
        <Typography
          variant='body2'
          color={
            status === 'В рассмотрении'
              ? 'orange'
              : status === 'Отклонена'
              ? 'red'
              : 'green'
          }
        >
          {status}
        </Typography>
      </CardContent>
    </Card>
  )
}
