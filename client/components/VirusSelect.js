'use strict';

const React = require('react');


class VirusSelect extends React.Component {


    render () {
        return (

                    <div >
                    	<div>
                    		<form className="form-checkbox">
                    		<div >
                        <h2>Select Virus</h2>
                          <div >
                            <label className="mapDisplay">
                              <input type="radio" name="chk1" className="hidden" onClick={this.props.setVirus.bind(this, {virus:1})} value="val2" autoComplete="off"/>
                              <img src="Images/strength.jpg" alt="..." className="img-class"/>
                            </label>
                          </div>

                          <div>
                            <label className="mapDisplay">
                              <input type="radio" name="chk1"  className="hidden" onClick={this.props.setVirus.bind(this, {virus:2})} value="val3"  autoComplete="off"/>
                              <img src="Images/Speed.jpg" alt="..." className="img-class"/>
                            </label>
                          </div>

                          <div >
                            <label className="mapDisplay">
                              <input type="radio" name="chk1" className="hidden"  onClick={this.props.setVirus.bind(this, {virus:3})} value="val4" autoComplete="off"/>
                              <img src="Images/Agility.jpg" alt="..." className="img-class"/>
                            </label>
                          </div>

                          <div >
                            <label className="mapDisplay">
                              <input type="radio" name="chk1" className="hidden" onClick={this.props.setVirus.bind(this, {virus:4})} value="val4"  autoComplete="off"/>
                              <img src="Images/Hybrid.jpg" alt="..." className="img-class" />
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

VirusSelect.propTypes = {
setVirus: React.PropTypes.func.isRequired,
};

module.exports = VirusSelect;
