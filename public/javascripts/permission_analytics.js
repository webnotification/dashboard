var React = require('react');
var ReactDOM = require('react-dom');
var Griddle = require('griddle-react');

ReactDOM.render(
    <Griddle results={data.permissions} 
        tableClassName="table" 
        showFilter={true}
        showSettings={true} 
        columns={["group", "timestamp", "accept", "reject"]}
        resultsPerPage={20} 
    />, 
    document.getElementById('main')
);
