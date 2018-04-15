'use strict';

const React = require('react');


class VirusSelect extends React.Component {

  getPNG (data){

    let isReady = false;
    let clientVirus = -1;
    let virusMap = new Map();
    console.log("this.props.clientId "  +  this.props.clientId);
    console.log("this.props.clientId "  +  this.props.currentRoomId);
    console.log("this.props.clientId "  +  this.props.rooms);
    // console.log("data " + JSON.stringify(this.props.rooms));


    for (var k = 0; k < Object.keys(this.props.rooms).length; k++) {
      if(this.props.rooms[k].id === this.props.currentRoomId){
        if(this.props.rooms[k].gameMode === "Teams"){
          for (var j = 0; j < Object.keys(this.props.rooms[k].teams).length; j++) {
            for (var i = 0; i < Object.keys(this.props.rooms[k].teams[j].clients).length; i++) {
              if (this.props.rooms[k].teams[j].clients[i].id === this.props.clientId){
                console.log("data " + JSON.stringify(this.props.rooms[k]));

                virusMap.set(1, this.props.rooms[k].virusState.strength);
                virusMap.set(2, this.props.rooms[k].virusState.speed);
                virusMap.set(3, this.props.rooms[k].virusState.agility);
                virusMap.set(4, this.props.rooms[k].virusState.balanced);
                clientVirus = this.props.rooms[k].teams[j].clients[i].virus;
              }
            }
          }
        } else {
            for (var i = 0; i < Object.keys(this.props.rooms[k].clients).length; i++) {


              if (this.props.rooms[k].clients[i].id === this.props.clientId){
                console.log("data " + JSON.stringify(this.props.rooms[k]));
                virusMap.set(1, this.props.rooms[k].virusState.strength);
                virusMap.set(2, this.props.rooms[k].virusState.speed);
                virusMap.set(3, this.props.rooms[k].virusState.agility);
                virusMap.set(4, this.props.rooms[k].virusState.balanced);
                clientVirus = this.props.rooms[k].clients[i].virus;
              }

          }
        }
      }
    }
    console.log("virus map " + virusMap);
    console.log("virus " + clientVirus);
let imageClass = 'image-display-' + data.virus;
    if (clientVirus === data.virus){
      console.log("client virus " + data.virus);
      return (
        <label className="mapDisplay centered">
        <div className={ imageClass  + " centered image-border"}></div>
        </label>
      ) ;
    } else if( !virusMap.get(data.virus) ) {
      console.log("visrus map " + virusMap.get(data.virus));
      console.log("virus " + data.virus);
      return (
        <label className="mapDisplay centered">
        { clientVirus !== -1 ? (<input type="radio" name="chk1" className="hidden" onClick={this.props.setVirus.bind(this, data)} value="val4"  autoComplete="off"/>):(null)}

            <div className={ imageClass  + " centered"}></div>
        </label>
      );
    }
    else {
      console.log("third loop asshole");
      return (
          <label className="mapDisplay centered">
            <div className={ imageClass  + " centered image-unavail"}></div>
          </label>
        );
    }
  }

    render () {
        return (

                    <div >
                    	<div>
                    		<form className="form-checkbox">
                    		<div className="centered" >
                        <h2 >Select Virus</h2>
                          <div >
                            {this.getPNG({virus: 1})}

                          </div>

                          <div >
                            {this.getPNG({virus: 2})}

                          </div>

                          <div >
                            {this.getPNG({virus: 3})}

                          </div>

                          <div >
                            {this.getPNG({virus: 4})}

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
  rooms: React.PropTypes.string,
  currentRoomId: React.PropTypes.string,
  clientId:React.PropTypes.string
};

module.exports = VirusSelect;
