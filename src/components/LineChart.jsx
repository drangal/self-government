import { LineChart } from '@mui/x-charts/LineChart'

export default function ComplaintsChart() {
  const data = [
    { date: new Date('2023-01-01'), complaints: 10 }, // Replace with your actual data
    { date: new Date('2023-02-01'), complaints: 15 },
    { date: new Date('2023-03-01'), complaints: 22 },
    { date: new Date('2023-04-01'), complaints: 2 },
    { date: new Date('2023-05-01'), complaints: 30 },
    { date: new Date('2023-06-01'), complaints: 2 },
    { date: new Date('2023-07-01'), complaints: 5 }
  ]
  return (
    <LineChart
      height={400}
      grid={{ vertical: true, horizontal: true }}
      xAxis={[
        {
          scaleType: 'point',
          data: data?.map((complaint) => complaint.date.toLocaleDateString())
        }
      ]}
      series={[
        {
          data: data?.map((complaint) => complaint.complaints),
          area: true
        }
      ]}
    />
  )
}
