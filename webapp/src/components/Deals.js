import React from 'react'
import { Collapse } from 'reactstrap'
import DealProgress from './DealProgress'
import Progressbar from './Progressbar'

const data = {
  labels: ['apples', 'bananas', 'cherries', 'dates'],
  values: [
    {
      month: 'Q1-2016',
      apples: 3840,
      bananas: 1920,
      cherries: 1960,
      dates: 400
    },
    {
      month: 'Q2-2016',
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400
    },
    { month: 'Q3-2016', apples: 640, bananas: 960, cherries: 640, dates: 600 },
    { month: 'Q4-2016', apples: 320, bananas: 480, cherries: 640, dates: 400 }
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
              <div className="my-4" style={{ width: '600px', height: '400px' }}>
                <DealProgress data={data} width={600} height={400} />
              </div>
            </Collapse>
          </li>
        </ul>
      </div>
    )
  }
}
export default Deals
