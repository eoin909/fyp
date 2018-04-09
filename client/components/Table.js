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

   render() {
       // Data
       var dataColumns = this.props.columns;
       var dataRows = this.props.records;

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

TableExample.propTypes = {
  columns: React.PropTypes.string,
  records: React.PropTypes.string
};

module.exports = TableExample;
