import React from 'react'
import _ from 'lodash'
import Deals from './Deals'
import Map from './Map'
import Parcel from './Parcel'
import AddData from './AddData'

class MyFarm extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { collapse: false, parcel: null }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse })
  }
  render() {
    return (
      <div className="page">
        <div className="mb-3">
          <Deals />
        </div>
        <div className="card">
          <div className="row">
            <div className="col-6">
              <div style={{ height: '500px' }}>
                <Map data onSelect={parcel => this.setState({ parcel })} />
              </div>
            </div>
            <div className="col-6">
              <Parcel parcel={this.state.parcel} />
            </div>
          </div>
        </div>
        <AddData />
      </div>
    )
  }
}
export default MyFarm
