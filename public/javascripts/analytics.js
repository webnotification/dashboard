var React = require('react');
var ReactDOM = require('react-dom');
var Griddle = require('griddle-react');

ReactDOM.render(
    <Griddle results={data.notifications} />, 
    document.getElementById('main')
);
