import React from 'react'

class AddData extends React.Component {
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Additional data</h2>
          <div className="card-text">
            Your current progress in this deal has been estimated automatically,
            based on <a href="http://sentinel-hub.com">Sentinel</a> satelite
            images and soil measurements (
            <a href="https://www.wur.nl/nl/show/Bodemfysische-Eenhedenkaart-BOFEK2012.htm">
              BOFEK2012
            </a>).
            <br />
            By uploading more data from your farm, you can:
            <ol>
              <li>improve the estimation on your deal progress;</li>
              <li>see how you are improving your farms ecology;</li>
              <li>
                get actionable suggestions on how to speed up your transition to
                herb-rich grassland
              </li>
              <li>
                help other farmers take the best course toward a more
                sustainable future;
              </li>
              <li>Show the world what you have achieved!</li>
            </ol>
            <h4>Connect your data sources</h4>
            <div className="btn-group" role="group" aria-label="">
              <button type="button" className="btn btn-secondary">
                Drone images
              </button>
              <button type="button" className="btn btn-secondary">
                Soil samples
              </button>
              <button type="button" className="btn btn-secondary">
                Ecological measures
              </button>
              <button
                type="button"
                className="btn btn-success d-flex align-items-center"
              >
                <i className="material-icons mr-2">check</i> Operational history
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddData
