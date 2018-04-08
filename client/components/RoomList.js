'use strict';

const React = require('react');


class RoomList extends React.Component {

  getJoinTeamButton(data){

console.log(typeof data);
    console.log(data);
    console.log(this.state);
    console.log(this.props);
    console.log(this);
    if (Object.keys(data.clients).length < 2){
      return (
        <button className="btn btn-sm btn-primary menu-btn"
          onClick={ this.props.onJoinTeam.bind(this, {roomId:this.props.currentRoomId, team: data.team}) } >
          Join Team
        </button>
      ) ;
    } else {
      return (
        null
      );
    }
  }

  getButton (data){
    if(data.ready ===false){
    return (
      <button className="btn btn-sm btn-danger menu-btn"
        onClick={ this.props.onReadyClick.bind(this, this.props.currentRoomId) } >
        Ready Up
      </button>
    );
  }
  else if (data.ready === true && data.color === null) {
    return (
      <button
          className="btn btn-sm btn-primary menu-btn">
        Ready
      </button>
    );
  }
  else {
    return (
      <button
        className="circle menu-btn"
        style={{backgroundColor: data.color}}  >
      </button>
    );
  }
}

    render () {
        return (
            <div>
                { this.props.currentRoomId ? (
                    <div className="menu">
                        <span className="menu-heading">Rooms
                            <button
                                className="btn btn-sm menu-btn"
                                onClick={ this.props.onRoomLeaveClick.bind(this, this.props.currentRoomId) }
                            >
                                Leave room
                            </button>
                        </span>
                        <span className="menu-item" >
                            Room id: { this.props.currentRoomId }
                        </span>


                        <span className="menu-item"  >

                        {
                          this.props.rooms.filter(room => room.id === this.props.currentRoomId).map((room, index) => {
                            return (
                              (room.gameMode === "Teams") ? (
                                  <span className="menu-item" key={ index } >
                                      <span    className="css-truncate">
                                          {
                                            room.teams.map((team, index1) => {
                                              return (
                                                <span>
                                                <span className="menu-heading  menu-item" key={ index1 } >
                                                  <span className = "css-truncate" >
                                                    { team.team }
                                                  </span>
                                                  {this.getJoinTeamButton(team)}
                                                </span>

                                              <span className="menu-item"  >
                                                {team.clients.map( (client, index2) => {
                                                  return (
                                                    <span className="menu-item" key={ index2 } >
                                                      <span className = "css-truncate" >
                                                       { client.name }
                                                      </span>
                                                      {this.getButton(client)}
                                                    </span>
                                                );})}
                                              </span>
                                              </span>
                                              );
                                            }
                                          )
                                        }
                                      </span>
                                    </span>



                                ):(



                                  room.clients.map((client, index) => {
                                    return (
                                      <span className="menu-item" key={ index } >

                                      <span className = "css-truncate" >

                                      { client.name}
                                      </span>
                                      {this.getButton(client)}
                                      </span>
                                    );
                                  })




                              )
                            );
                          })
                        }



                      </span>




                    </div>


                    ) : (
                        <div className="menu">
                            <span className="menu-heading">Rooms
                                <button
                                    className="btn btn-sm btn-primary menu-btn"
                                    onClick={ this.props.onRoomCreateClick.bind(this, {gameMode: "Free For All"}) }
                                >
                                    Free For All
                                </button>
                                <button
                                    className="btn btn-sm btn-primary menu-btn"
                                    onClick={ this.props.onRoomCreateClick.bind(this, {gameMode: "Teams"}) }
                                >
                                    Teams
                                </button>
                            </span>
                                { this.props.rooms.map((room, index) => {
                                    return (
                                        <span className="menu-item" key={ index } >
                                            <span
                                                className="css-truncate"
                                            >
                                                Room id: { room.id }
                                                {!room.isGameStarted ? (
                                                <button
                                                    className="btn btn-sm menu-btn"
                                                    onClick={ this.props.onRoomClick.bind(this, room) }
                                                >
                                                    Join
                                                </button>
                                              ) : (null)}
                                            </span>
                                            <span
                                                className="css-truncate centered"
                                            >
                                                Game Mode: { room.gameMode }
                                            </span>

                                        </span>
                                    );
                                }) }

                        </div>

                    )
                }

            </div>
        );
    }
}

RoomList.propTypes = {
    rooms: React.PropTypes.array.isRequired,
    onRoomClick: React.PropTypes.func.isRequired,
    onJoinTeam: React.PropTypes.func.isRequired,
    onReadyClick: React.PropTypes.func.isRequired,
    onRoomCreateClick: React.PropTypes.func.isRequired,
    onRoomLeaveClick: React.PropTypes.func.isRequired,
    currentRoomId: React.PropTypes.string
};

module.exports = RoomList;
