import React from 'react'
import { Collapse } from 'reactstrap'
import DealProgress from './DealProgress'
import Progressbar from './Progressbar'

const data = {
  labels: ['herb-rich grassland', 'mixed grassland', 'herb-poor grassland'],
  values: [
    {
      month: '2015',
      'herb-rich grassland': 0,
      'mixed grassland': 3,
      'herb-poor grassland': 5
    },
    {
      month: '2016',
      'herb-rich grassland': 1,
      'mixed grassland': 6,
      'herb-poor grassland': 3
    },
    {
      month: '2017',
      'herb-rich grassland': 2,
      'mixed grassland': 5,
      'herb-poor grassland': 3
    },
    {
      month: '2018',
      'herb-rich grassland': 3,
      'mixed grassland': 5,
      'herb-poor grassland': 2
    }
  ]
}

class Deals extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { collapse: false }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse })
  }
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Biodiversity deals</h1>
          <div className="card-text">These are your current deals.</div>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <h5>20% herb rich grass land</h5>
            <div className="row align-items-end">
              <div className="col">
                <Progressbar
                  progress={[
                    { label: 'Kruidenrijk', color: 'success', value: 3 },
                    { label: 'Gemengde grassen', color: 'warning', value: 4 },
                    { label: 'Kruidenarm', color: 'danger', value: 2 }
                  ]}
                />
              </div>
              <div className="col-1">
                <div
                  className="btn btn-light d-flex align-items-center justify-content-center"
                  style={{ height: '40px' }}
                  onClick={this.toggle}
                >
                  <i style={{ fontSize: '28px' }} className="material-icons">
                    keyboard_arrow_down
                  </i>
                </div>
              </div>
            </div>
            <Collapse isOpen={this.state.collapse}>
              <div className="my-4" style={{ width: '900px', height: '400px' }}>
                <DealProgress data={data} width={900} height={400} />
              </div>
            </Collapse>
          </li>
        </ul>
      </div>
    )
  }
}
export default Deals
