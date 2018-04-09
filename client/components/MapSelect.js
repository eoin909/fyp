'use strict';

const React = require('react');


class MapSelect extends React.Component {

    render () {
        return (
          <div >
          	<div>

          		<form className="form-checkbox">
          		<div>
              <h2>Select Map</h2>
                <div >
                  <label className="mapDisplay">
                    <input type="radio" name="chk1" className="hidden" onClick={this.props.setMap.bind(this, {map:1})} value="val2" autoComplete="off"/>
                    <img src="Images/Map1.jpg" alt="..." className="img-class-map"/>
                  </label>
                </div>

                <div>
                  <label className="mapDisplay">
                    <input type="radio" name="chk1"  className="hidden" onClick={this.props.setMap.bind(this, {map:2})} value="val3"  autoComplete="off"/>
                    <img src="Images/Map2.jpg" alt="..." className="img-class-map"/>
                  </label>
                </div>

                <div >
                  <label className="mapDisplay">
                    <input type="radio" name="chk1" className="hidden"  onClick={this.props.setMap.bind(this, {map:3})} value="val4" autoComplete="off"/>
                    <img src="Images/Map3.jpg" alt="..." className="img-class-map" />
                  </label>
                </div>

                <div >
                  <label className="mapDisplay">
                    <input type="radio" name="chk1" className="hidden" onClick={this.props.setMap.bind(this, {map:4})} value="val4"  autoComplete="off"/>
                    <img src="Images/Map4.jpg" alt="..." className="img-class-map"/>
                  </label>
                </div>

              </div>
          		<div >
            </div>
          		</form>
          	</div>
          </div>
        );
    }
}

MapSelect.propTypes = {
setMap: React.PropTypes.func.isRequired,
};

module.exports = MapSelect;
