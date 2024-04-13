import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  Typography
} from '@mui/material'

const data = [
  {
    storeName: 'Магазин 1',
    products: [
      { id: 1, name: 'Товар A', price: 100, allowedPrice: 80, difference: 20 },
      { id: 2, name: 'Товар B', price: 120, allowedPrice: 90, difference: 30 }
    ] // Nested products array
  },
  {
    storeName: 'Магазин 2',
    product: 'Товар C', // Single product
    price: 150,
    allowedPrice: 120,
    difference: 30
  }
  // ... other data
]

export const ComplaintsTable = () => {
  // ... (Other component logic)

  const handleSignCell = (event) => {
    // Implement your logic to handle signing the cell based on the event
    // For example, you might update state to indicate a signed cell
    console.log('Cell signed:', event.target.textContent) // Temporary logging
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='left'>
              <Typography variant='body2'>Наименование магазина</Typography>
            </TableCell>
            <TableCell align='left'>
              <Typography variant='body2'>Товар</Typography>
            </TableCell>
            <TableCell align='right'>
              <Typography variant='body2'>Цена</Typography>
            </TableCell>
            <TableCell align='right'>
              <Typography variant='body2'>Допустимая цена</Typography>
            </TableCell>
            <TableCell align='right'>
              <Typography variant='body2'>Разница</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.storeName}>
              <TableCell
                onClick={handleSignCell}
                style={{ cursor: 'pointer' }} // Optional: Set cursor to 'pointer' on hover
              >
                {row.storeName}
              </TableCell>
              {row.products ? (
                <>
                  <TableCell
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.products.map((product) => (
                      <span key={product.id}>
                        {product.name}
                        <br />
                      </span>
                    ))}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.products.map((product) => (
                      <span key={product.id}>
                        {product.price}
                        <br />
                      </span>
                    ))}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.products.map((product) => (
                      <span key={product.id}>
                        {product.allowedPrice}
                        <br />
                      </span>
                    ))}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{
                      cursor: 'pointer'
                    }}
                  >
                    {row.products.map((product) => (
                      <span
                        key={product.id}
                        style={{
                          color: product.difference > 0 ? 'red' : 'green'
                        }}
                      >
                        {product.difference}
                        <br />
                      </span>
                    ))}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.product}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.price}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.allowedPrice}
                  </TableCell>
                  <TableCell
                    align='right'
                    onClick={handleSignCell}
                    style={{
                      cursor: 'pointer',
                      color: row.difference > 0 ? 'red' : 'green'
                    }}
                  >
                    {row.difference}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
