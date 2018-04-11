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
            images and ground measurements of{' '}
            <a href="https://www.wur.nl/nl/show/Bodemfysische-Eenhedenkaart-BOFEK2012.htm">
              BOFEK2012
            </a>.
            <br />
            By uploading more data from your farm, you can:
            <ol>
              <li>improve the estimation on your deal progress;</li>
              <li>see how you are improving your farms ecology;</li>
              <li>
                help other farmers take the best course toward a more
                sustainable future;
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }
}

export default AddData
