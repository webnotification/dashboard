// app/routes.js
var request = require('request');
var config = require('./../config/config');
var multer = require('multer');
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-1';
var s3_bucket_name = 'notificationicons';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/../uploads');
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id);
  }
})

var upload = multer({ storage: storage })

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.get('/profile', isLoggedIn, function(req, res) {
        var err_msg = '';
        flash_msg = req.flash('err_msg');
        if (flash_msg.length > 0)
            err_msg = flash_msg[0];
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            image : config.NOTIFICATION_IMAGE_BASE_PATH + req.user.id,
            err_msg : err_msg
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Send notification
    app.get('/send_notification', isLoggedIn, function(req, res, next) {
        params = {'client_id': req.user.id}
        request({url: config.get_groups_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    groups = JSON.parse(body)['groups'];
                    res.render('send_notification.ejs', { title: 'Send', website: req.user.local.website, groups: groups });
                }
            else{
                    res.render('profile.ejs');
            }
        });
    });
    
    app.post('/send_notification', function(req, res){
        params = req.body;
        params['client_id'] = req.user.id;
        request.post(
            config.send_notification_url,
            { form: params },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
        res.render('sent_notification.ejs');
    })
    
    
    //Send permission request
    app.get('/send_permission_request', isLoggedIn, function(req, res, next) {
        params = {'client_id': req.user.id}
        request({url: config.get_groups_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    groups = JSON.parse(body)['groups'];
                    res.render('send_permission.ejs', { title: 'Send', website: req.user.local.website, groups: groups });
                }
            else{
                    res.render('profile.ejs');
            }
        });
    });
    
    app.post('/send_permission_request', function(req, res){
        params = req.body;
        params['client_id'] = req.user.id;
        request.post(
            config.send_permission_url,
            { form: params },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
        res.render('sent_permission.ejs');
    })
    
    
    //Create group
    app.get('/create_group', isLoggedIn, function(req, res, next) {
            res.render('create_group.ejs', { title: 'Create group', website: req.user.local.website, err_msg: '' });
    });
    
    app.post('/create_group', function(req, res, next) {
        params = req.body
        params['client_id'] = req.user.id
        request({url: config.generate_group_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(JSON.parse(body).error == 'IntegrityError'){
                    res.render('create_group.ejs', { 
                        title: 'Create group', 
                        website: req.user.local.website, 
                        err_msg: 'group name already exists.' 
                    });
                }
                else{
                    res.render('group_created.ejs');
                }
            }
        });
    });
   
    app.get('/view_groups', isLoggedIn, function(req, res){
        params = {'client_id': req.user.id}
        request({url: config.get_groups_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    groups = JSON.parse(body)['groups'];
                    res.render('view_groups.ejs', { website: req.user.local.website, groups: groups});
                }
            else{
                    res.render('profile.ejs');
            }
        });
    });

    app.get('/permission_analytics', isLoggedIn, function(req, res){
        params = {'client_id': req.user.id}
        request({url: config.get_permission_analytics_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    res.render('permission_analytics.ejs', {title: 'Analytics', data: JSON.parse(body)});
                }
        });
    });

    app.get('/notification_analytics', isLoggedIn, function(req, res){
        params = {'client_id': req.user.id}
        request({url: config.get_notification_analytics_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    res.render('notification_analytics.ejs', {title: 'Analytics', data: JSON.parse(body)});
                }
        });
    });

    app.post('/upload_image', upload.single('userPhoto'), function (req, res, next) {
        if(req.file.size < config.IMAGE_SIZE_THRESHOLD){
            var bodyStream = fs.createReadStream(req.file.path);
            var s3 = new AWS.S3(); 
            s3.createBucket({Bucket: s3_bucket_name}, function() {
                var params = {Bucket: s3_bucket_name, Key: req.user.id, Body: bodyStream};
                s3.putObject(params, function(err, data) {
                  if (err)
                      console.log(err)     
                  else
                      console.log("Successfully uploaded data to myBucket/myKey");   
                  res.redirect('/profile');
                });
            });
        }
        else{
            req.flash('err_msg', config.IMAGE_SIZE_MESSAGE);
            res.redirect('/profile');
        }
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}



