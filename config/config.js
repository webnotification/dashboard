var base_url = 'http://127.0.0.1:8000/notification'; 

module.exports = {
    get_groups_url : base_url + '/get_groups',
    generate_group_url : base_url + '/generate_group',
    send_notification_url : base_url + '/send_notification',
    send_permission_url : base_url + '/send_permission_message',
    get_notification_analytics_url : base_url + '/get_notification_analytics'
}
