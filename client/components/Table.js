const React = require("react");

//const { makeData, Logo, Tips } = require( "./Utils");

// Import React Table
const ReactTable = require('react-table');

//import ReactTable from "react-table";
// import "react-table/react-table.css";
// require('react-bootstrap-table/dist/react-bootstrap-table-all.min.css');

require('react-table/react-table.css');

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn } = require('material-ui/Table');
/**
 * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
 */
 class TableExample extends React.Component {
   constructor (props) {
       super(props);

       this.state = {
           columns: ["Rank","UserName","Highscore"],
           records:[
             {"UserName":"damian404","Highscore":830,"Rank":1},
             {"UserName":"gary123","Highscore":455,"Rank":2},
             {"UserName":"david868","Highscore":400,"Rank":3},
             {"UserName":"jason","Highscore":350,"Rank":4},
             {"UserName":"edel568","Highscore":200,"Rank":5},
             {"UserName":"Eoin909","Highscore":0,"Rank":6},
             {"UserName":"eoin909","Highscore":0,"Rank":7},
             {"UserName":"eoin989","Highscore":0,"Rank":8}]
       };
   }



   render() {
       // Data
       var dataColumns = this.state.columns;
       var dataRows = this.state.records;

       var tableHeaders = (<thead class="blue-grey lighten-4" >
             <tr>
               {dataColumns.map(function(column) {
                 return <th ><h3>{column}</h3></th>; })}
             </tr>
         </thead>);

       var tableBody = dataRows.map(function(row) {
         return (
           <tr>
             {dataColumns.map(function(column) {
               return <th> <h5>{row[column]}</h5></th>; })}
           </tr>); });

       // Decorate with Bootstrap CSS
       return (<table width="100%">
           {tableHeaders}
           {tableBody}
         </table>) }

};

module.exports = TableExample;
