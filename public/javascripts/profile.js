var React = require('react');
var ReactDOM = require('react-dom');

var Details = React.createClass({
    render: function(){
    return (
            <div>
                <h2> Profile </h2>
                <h5><strong>id</strong>: {user._id}</h5>
                <h5><strong>email</strong>: {user.local.email} </h5>
                <h5><strong>website</strong>: {user.local.website} </h5>
                <h4><a href="/send_permission_request"> send permission request </a></h4>
                <h4><a href="/send_notification"> send notification </a></h4>
                <h4><a href="/create_group"> create group</a></h4>
                <h4><a href="/view_groups"> view groups</a></h4>
                <h4><a href="/notification_analytics"> notification analytics</a></h4>
                <h4><a href="/permission_analytics"> permission analytics</a></h4>
                <h4><a href="/logout">logout</a></h4>
            </div>
            );
    }
});

ReactDOM.render(
       <div> 
        <Details />
       </div>,
document.getElementById('main'));
