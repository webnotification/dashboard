var React = require('react');
var ReactDOM = require('react-dom');

var Details = React.createClass({
    render: function(){
    
    var group_options = groups.map(function(group){
        return <option value= {group.id} > {group.name}({group.percentage}) </option>;
    });
    
    return (
    <div>
        <h2> Send Message </h2>
        <form name="send_message" action="/send_notification"  method="post">
            <div>
                <label>Website</label>
                <input name="website" type="text" value={website}></input>
            </div>
            <div>
                <label>Group</label>
                <select name="group_id">{group_options}</select> 
            </div>
            <div> 
                <label>Title</label>
                <input name="title"  type="text"  width="400px"></input>
            </div>
            <div>
                <label>Message</label>
                <textarea name="message" type="description"></textarea>
            </div>
            <div>
                <label>Target URL</label>
                <input name="target_url" type="text"></input>
            </div>
            <div>
                <label>Date</label>
                <input type="date" name="date"></input>
            </div>
            <div>
                <label>Time</label>
                <input type="time" name="time"></input>
            </div>
            <div>
                <input type="submit" value="Send"></input>
            </div>
        </form>
        <form action="javascript:history.back()" method="get">
            <button>Back</button>
        </form>
    </div>
    )
    }
});

ReactDOM.render(
    <div>
        <Details />
    </div>,
document.getElementById('main'));

