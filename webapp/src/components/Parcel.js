import React from 'react'
import _ from 'lodash'

const colorize = c => {
  console.log(c)
  if (c === 'A' || c === 'B') return 'bg-success'
  if (c === 'C') return 'bg-warning'
  if (c === 'D') return 'bg-danger'
  return 'bg-secondary'
}

const Parcel = ({ parcel }) => {
  const classification = _.get(parcel, 'properties.classification', 'N/A')
  return (
    <div className="row my-4 mr-0 pr-3">
      <div className="col-8">
        <div className="card bg-secondary text-white">
          <div className="card-header">
            Parcel {_.get(parcel, 'properties.fieldid')}
          </div>
          <div className="card-body">
            <h3 className="card-title">2018 KPIs</h3>
            <div className="card-text">Herb species: {_.random(4)}</div>
          </div>
          {classification == 'C' && (
            <div className="card-body bg-light text-dark">
              <div className="card-title">Advice (geel)</div>
              <div className="card-text d-flex align-items-top mb-3">
                <i className="material-icons">check</i>
                <span>
                  Lower nutrient supply by 10%<br />
                  <small>
                    Based on improved results on 5 farms in your collecive
                  </small>
                </span>
              </div>
              <div className="card-text d-flex align-items-top mb-3">
                <i className="material-icons">check</i>
                <span>
                  Increase ground watertable to 40cm below surface<br />
                  <small>Based on information from Waterschappen</small>
                </span>
              </div>
            </div>
          )}
          {classification == 'B' && (
            <div className="card-body bg-light text-dark">
              <div className="card-title">Advice (groen)</div>
              <div className="card-text d-flex align-items-top mb-3">
                <i className="material-icons">check</i>
                <span>
                  Let herbs come to bloom by delay mowing of the whole field or
                  specific area<br />
                  <small>Based on best practices</small>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-4 text-center">
        <h5 className="small text-muted">Automatically generated score</h5>
        <div
          className={['card', colorize(classification)].join(', ')}
          style={{ borderRadius: '1000px' }}
        >
          <div className="display-2 text-white py-3">{classification}</div>
        </div>
      </div>
    </div>
  )
}

export default Parcel
