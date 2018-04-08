'use strict';

const React = require('react');


class VirusSelect extends React.Component {


    render () {
        return (


                    <div >
          	<div>
          		<form className="form-checkbox">
          		<div >
                <div >
                  <label >
                    <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Basketball.png" alt="..." className="img-class"/>
                    <input type="radio" name="chk1" className="hidden"  onClick={ this.props.setVirus.bind(this, {virus:1}) } value="virus1" autoComplete="off"/>
                  </label>
                </div>
                <div>
                  <label >
                    <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Football.png" alt="..." className="img-class" />
                    <input type="radio" name="chk1" value="virus2"  onClick={ this.props.setVirus.bind(this,  {virus:2}) } autoComplete="off"/>
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
