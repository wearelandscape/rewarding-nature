import React from 'react'
import _ from 'lodash'

const colorize = c => {
  if (c === 'A' || c === 'B') return 'bg-success'
  if (c === 'C') return 'bg-warning'
  if (c === 'D') return 'bg-danger'
  return 'bg-light text-secondary'
}

const Parcel = ({ parcel }) => {
  const classification = _.get(parcel, 'properties.classificatie.0', 'N/A')

  if (!parcel)
    return (
      <div className="row my-4 mr-0 pr-3 text-center">
        <h2
          className="text-muted text-center mt-4"
          style={{ textAlign: 'center' }}
        >
          Select a field
        </h2>
      </div>
    )

  const herbs = () => {
    if (classification === 'D') return 0
    if (classification === 'C') return _.random(1, 3)
    if (classification === 'B') return _.random(4, 20)
    else return 'n/a'
  }

  return (
    <div className="row my-4 mr-0 pr-3">
      <div className="col-8">
        <div className="card bg-secondary text-white">
          <div className="card-header">
            Field {_.get(parcel, 'properties.fieldid')} ({Math.round(
              _.get(parcel, 'properties.area', 0) / 100,
              2
            ) / 100}{' '}
            Ha)
          </div>
          <div className="card-body">
            <h3 className="card-title">2018 KPIs</h3>
            <div className="card-text">Herb species: {herbs()}</div>
          </div>
          {classification === 'C' && (
            <div className="card-body bg-light text-dark">
              <div className="card-title">Advice</div>
              <div className="card-text d-flex align-items-top mb-3">
                <i className="material-icons">check</i>
                <span>
                  Plantain Chickory, White clover and Yarrow<br />
                  <small>
                    These herbs fit best on your uploaded soil data of june
                    2017.
                  </small>
                </span>
              </div>
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
          {classification === 'B' && (
            <div className="card-body bg-light text-dark">
              <div className="card-title">Advice</div>
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
        <h5 className="small text-muted">Automatically generated KPI score</h5>
        <div
          className={['card text-white', colorize(classification)].join(' ')}
          style={{ borderRadius: '1000px' }}
        >
          <div className="display-2 py-3">{classification}</div>
        </div>
        {classification !== 'N/A' ? (
          <div className="mt-4 btn btn-info btn-small">I don't agree</div>
        ) : null}
      </div>
    </div>
  )
}

export default Parcel
