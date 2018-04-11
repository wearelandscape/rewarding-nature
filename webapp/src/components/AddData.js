import React from 'react'

class AddData extends React.Component {
  render() {
    return (
      <div className="row mt-4">
        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Additional data</h3>
              <div className="card-text">
                Your current progress in this deal has been estimated
                automatically, based on{' '}
                <a href="http://sentinel-hub.com">Sentinel</a> satelite images
                and soil measurements (
                <a href="https://www.wur.nl/nl/show/Bodemfysische-Eenhedenkaart-BOFEK2012.htm">
                  BOFEK2012
                </a>).
                <br />
                By uploading more data from your farm, you can:
                <ol>
                  <li>improve the estimation on your deal progress;</li>
                  <li>see how you are improving your farms ecology;</li>
                  <li>
                    get actionable suggestions on how to speed up your
                    transition to herb-rich grassland
                  </li>
                  <li>
                    help other farmers take the best course toward a more
                    sustainable future;
                  </li>
                  <li>Show the world what you have achieved!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="list-group">
            <div className="list-group-item">
              <h3>Connect your data sources</h3>
            </div>
            <div
              href="#"
              className="list-group-item list-group-item-action flex-column align-items-start"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Drone images</h5>
                <small>last upload was 2 months ago</small>
              </div>
              <p className="mb-1">
                Drone images are analysed to provide insight in distribution of
                herbs per field.
              </p>
              <button
                href="#"
                className="btn btn-outline-dark d-flex align-items-center"
              >
                <i className="material-icons">file_upload</i> upload your images
              </button>
            </div>
            <div className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Soil samples</h5>
                <small className="text-muted">-</small>
              </div>
              <p className="mb-1" />
              <button
                href="#"
                className="btn btn-outline-dark d-flex align-items-center"
              >
                <i className="material-icons">file_upload</i> upload soil sample
                data
              </button>
            </div>
            <div className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Ecological measures</h5>
                <small className="text-muted">-</small>
              </div>
              <p className="mb-1">State the ecological measures you took.</p>
              <button
                href="#"
                className="btn btn-outline-dark d-flex align-items-center"
              >
                <i className="material-icons">file_upload</i> tell us your
                ecological measures
              </button>
            </div>
            <div className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Operational history</h5>
                <small className="text-success">sync active</small>
              </div>
              <p className="mb-1">
                Connect HERBee to your operational systems to improve reporting.
              </p>
              <button
                type="button"
                className="btn btn-success d-flex align-items-center"
              >
                <i className="material-icons mr-2">check</i> Operational history
                synced
              </button>
              <p>
                This information is not shared to anyone in your collective. You
                can change this in your <a href="#">sharing settings</a>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddData
