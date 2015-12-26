var React = require('react');
var ReactDOM = require('react-dom');
var Griddle = require('griddle-react');

ReactDOM.render(
    <Griddle results={data.notifications} 
        tableClassName="table" 
        showFilter={true}
        showSettings={true} 
        columns={["title", "group", "target_url", "timestamp", "accept", "reject"]}
        resultsPerPage={20} 
    />, 
    document.getElementById('main')
);
