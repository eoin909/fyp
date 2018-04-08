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


                    <div >
          	<div>
          		<form className="form-checkbox">
          		<div >
                <div >
                  <label >
                    <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Basketball.png" alt="..." className="img-class"/>
                    <input type="radio" name="chk1" className="hidden" onClick={this.props.setMap.bind(this, {map:1})} value="val2" autoComplete="off"/>
                  </label>
                </div>
                <div>
                  <label >
                    <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Football.png" alt="..." className="img-class" />
                    <input type="radio" name="chk1" onClick={this.props.setMap.bind(this, {map:2})} value="val3"  autoComplete="off"/>
                  </label>
                </div>

                <div >
                  <label >
                    <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..."/>
                    <input type="radio" name="chk1"  onClick={this.props.setMap.bind(this, {map:3})} value="val4" autoComplete="off"/>
                  </label>
                </div>
                <div >
                <label ><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." />
                <input type="radio" name="chk1"  onClick={this.props.setMap.bind(this, {map:4})} value="val4"  autoComplete="off"/></label></div>
              </div>
          		<div >
            </div>
          		</form>
          	</div>
          </div>
        );















        //   <form>
        //     <div className="cc-selector">
        //         <input id="visa" type="radio" name="credit-card" value="visa" />
        //         <label className="drinkcard-cc visa" for="visa"></label>
        //         <input id="mastercard" type="radio" name="credit-card" value="mastercard" />
        //         <label className="drinkcard-cc mastercard"for="mastercard"></label>
        //     </div>
        // </form>
//)
//           <div class="middle">
//   <h1>CSS Radio Button</h1>
//   <label>
//   <input type="radio" name="radio" checked/>
//   <div className="front-end box">
//     <span>Front-end</span>
//   </div>
// </label>
//
//   <label>
//   <input type="radio" name="radio"/>
//   <div className="back-end box">
//     <span>Back-end</span>
//   </div>
// </label>
// </div>
// )

//           <div nameClass="container">
// 	<div nameClass="row">
// 		<form method="get">
// 		<div nameClass="form-group">
//       <div nameClass="col-md-2 box">
//         <label nameClass="btn btn-primary">
//           <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Basketball.png" alt="..." nameClass="img-thumbnail img-check"/>
//           <input type="radio" name="chk1" id="item4" value="val2" nameClass="hidden" autocomplete="off"/>
//         </label>
//       </div>
//       <div nameClass="col-md-2 box">
//         <label nameClass="btn btn-primary">
//           <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Football.png" alt="..." nameClass="img-thumbnail img-check"/>
//           <input type="radio" name="chk1" id="item4" value="val3" nameClass="hidden" autocomplete="off"/>
//         </label>
//       </div>
//
//       <div nameClass="col-md-2 box">
//         <label nameClass="btn btn-primary">
//           <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." nameClass="img-thumbnail img-check"/>
//           <input type="radio" name="chk1" id="item4" value="val4" nameClass="hidden" autocomplete="off"/>
//         </label>
//       </div>
//       <div nameClass="col-md-2 box">
//       <label nameClass="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." nameClass="img-thumbnail img-check"/>
//       <input type="radio" name="chk1" id="item4" value="val4" nameClass="hidden" autocomplete="off"/></label></div>
//     </div>
// 		<div nameClass="clearfix"></div>
//
// 		<input type="submit" value="Check Item" nameClass="btn btn-success"/>
//
// 		</form>
// 	</div>
// </div>
          // <div class="image-radio">
          //   <input type="radio" value="true" checked="checked" name="ice_cream" id="ice_cream_vanilla"/>
          //   <label for="ice_cream_vanilla">Vanilla</label>
          //   <input type="radio" value="true" name="ice_cream" id="ice_cream_chocolate"/>
          //
          //   <label for="ice_cream_chocolate">Chocolate
          //   </label>
          // </div>
      //  );

//           .image-radio {
//   input[type=radio] {
//     display: none;
//   }
//   input[type=radio] + label {
//     background: asset-url('icons/choice-unchecked.svg') no-repeat left;
//     padding-left: 2rem;
//   }
//   input[type=radio]:checked + label {
//     background: asset-url('icons/choice-checked.svg') no-repeat left;
//   }
// }
//           <form>
//   <div className="class-selector">
//   <div class="col-md-2 box">
//     <label for="happy" class="btn btn-primary">
//       <img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Running.png" alt="..." class="img-thumbnail img-check"/>
//     </label>
//
//     <input type="radio" name="chk1" id="happy" value="val1" className="class-selector" autocomplete="off"/>
//
//   </div>
//   <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Basketball.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val2" class="hidden" autocomplete="off"/></label></div>
//   <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Football.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val3" class="hidden" autocomplete="off"/></label></div>
//   <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val4" class="hidden" autocomplete="off"/></label></div>
//   <div class="col-md-2 box"><label class="btn btn-primary"><img src="http://content.nike.com/content/dam/one-nike/globalAssets/menu_header_images/OneNike_Global_Nav_Icons_Soccer.png" alt="..." class="img-thumbnail img-check"/><input type="radio" name="chk1" id="item4" value="val4" class="hidden" autocomplete="off"/></label></div>
//   </div>
// </form>
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
  //    );
    }
}

MapSelect.propTypes = {
setMap: React.PropTypes.func.isRequired,
};

module.exports = MapSelect;
