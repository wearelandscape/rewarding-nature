import React from 'react'
import _ from 'lodash'
import { Progress } from 'reactstrap'

const Progressbar = ({ progress }) => {
  const total = _.sumBy(progress, 'value')
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="small text-muted">0%</div>
        <div className="small text-muted">20%</div>
      </div>
      <Progress multi style={{ height: '40px' }}>
        {progress.map(({ label, value, color }, i) => (
          <Progress bar color={color} value={value / total * 100} key={i}>
            {label}
          </Progress>
        ))}
      </Progress>
    </div>
  )
}

export default Progressbar
