// app/routes.js
var request = require('request');
var config = require('./../config/config');

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
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Send message
    app.get('/send', function(req, res, next) {
        params = {'website': req.user.local.website}
        request({url: config.get_groups_url, qs: params}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                    groups = JSON.parse(body)['groups'];
                    res.render('send.ejs', { title: 'Send', website: req.user.local.website, groups: groups });
                }
            else{
                    res.render('profile.ejs');
            }
        });
    });
    
    app.post('/send', function(req, res){
        request.post(
            config.send_notification_url,
            { form: req.body },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );
        res.render('sent.ejs');
    })
    
    
    //Create group
    app.get('/create_group', function(req, res, next) {
            res.render('create_group.ejs', { title: 'Create group', website: req.user.local.website, err_msg: '' });
    });
    
    app.post('/create_group', function(req, res, next) {
        request({url: config.generate_group_url, qs: req.body}, function (error, response, body) {
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
   
    app.get('/view_groups', function(req, res){
        params = {'website': req.user.local.website}
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

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}



