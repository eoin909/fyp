'use strict';

const React = require('react');


class MapSelect extends React.Component {

//   getButton (data){
//     if(data.ready ===false){
//     return (
//       <button className="btn btn-sm btn-danger menu-btn"
//         onClick={ this.props.onReadyClick.bind(this, this.props.currentRoomId) } >
//         Ready Up
//       </button>
//     );
//   }
//   else if (data.ready === true && data.color === null) {
//     return (
//       <button
//           className="btn btn-sm btn-primary menu-btn">
//         Ready
//       </button>
//     );
//   }
//   else {
//     return (
//       <button
//         className="circle menu-btn"
//         style={{backgroundColor: data.color}}  >
//       </button>
//     );
//   }
// }

    render () {
        return (
          <form>
  <div className="radio">
  <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Running.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val1" class="hidden" autocomplete="off"/></label></div>
  <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Basketball.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val2" class="hidden" autocomplete="off"/></label></div>
  <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Football.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val3" class="hidden" autocomplete="off"/></label></div>
  <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val4" class="hidden" autocomplete="off"/></label></div>
  <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val4" class="hidden" autocomplete="off"/></label></div>
  </div>
</form>
        //     <div>
        //         { this.props.currentRoomId ? (
        //             <div className="menu">
        //                 <span className="menu-heading">Rooms
        //                     <button
        //                         className="btn btn-sm menu-btn"
        //                         onClick={ this.props.onRoomLeaveClick.bind(this, this.props.currentRoomId) }
        //                     >
        //                         Leave room
        //                     </button>
        //                 </span>
        //                 <span className="menu-item" >
        //                     Room id: { this.props.currentRoomId }
        //                 </span>
        //                 <span className="menu-item" >
        //                     { this.props.rooms.filter(room => room.id === this.props.currentRoomId).map((room, index) => {
        //                         return (
        //
        //                             <span className="menu-item" key={ index } >
        //                                 <span    className="css-truncate">
        //                                 {
        //
        //                                 room.clients.map((client, index) => {
        //                                     return (
        //                                     <span className="menu-item" key={ index } >
        //
        //                                         <span className = "css-truncate" >
        //
        //                                         { client.name}
        //                                         </span>
        //                                         {this.getButton(client)}
        //                                     </span>
        //                                     );
        //                                 }) }
        //                             </span>
        //                         </span>
        //                     );
        //                 }) }
        //                 </span>
        //             </div>
        //
        //
        //             ) : (
        //                 <div className="menu">
        //                     <span className="menu-heading">Rooms
        //                         <button
        //                             className="btn btn-sm btn-primary menu-btn"
        //                             onClick={ this.props.onRoomCreateClick }
        //                         >
        //                             Create room
        //                         </button>
        //                     </span>
        //                         { this.props.rooms.map((room, index) => {
        //                             return (
        //                                 <span className="menu-item" key={ index } >
        //                                     <span
        //                                         className="css-truncate"
        //                                     >
        //                                         Room id: { room.id }
        //                                     </span>
        //                                     {!room.isGameStarted ? (
        //                                     <button
        //                                         className="btn btn-sm menu-btn"
        //                                         onClick={ this.props.onRoomClick.bind(this, room) }
        //                                     >
        //                                         Join
        //                                     </button>
        //                                   ) : (null)}
        //                                 </span>
        //                             );
        //                         }) }
        //
        //                 </div>
        //
        //             )
        //         }
        //
        //     </div>
        //
      );
    }
}

// RoomList.propTypes = {
//     rooms: React.PropTypes.array.isRequired,
//     onRoomClick: React.PropTypes.func.isRequired,
//     onReadyClick: React.PropTypes.func.isRequired,
//     onRoomCreateClick: React.PropTypes.func.isRequired,
//     onRoomLeaveClick: React.PropTypes.func.isRequired,
//     currentRoomId: React.PropTypes.string
// };

module.exports = MapSelect;
