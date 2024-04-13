import { PieChart } from '@mui/x-charts/PieChart'

export default function PieActiveArc({ data }) {
  return (
    <PieChart
      height={200}
      slotProps={{ legend: { hidden: true } }}
      skipAnimation
      series={[
        {
          data,
          highlightScope: { highlighted: 'item' }
        }
      ]}
    />
  )
}
