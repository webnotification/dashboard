// app/routes.js
var request = require('request');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs');
        //res.render('index.jade');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    //Send message
    app.get('/send', function(req, res, next) {
            var url = 'http://127.0.0.1:8000/notification/get_groups';
            params = {'website': req.user.local.website}
            request({url: url, qs: params}, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                            groups = JSON.parse(body)['groups'];
                            res.render('send.ejs', { title: 'Send', website: req.user.local.website, groups: groups });
                        }
                    else{
                            res.render('profile.ejs');
                    }
                });
        });
    
    //Create group
    app.get('/create_group', function(req, res, next) {
            res.render('create_group.ejs', { title: 'Create group', website: req.user.local.website, err_msg: '' });
        });
    
    app.post('/create_group', function(req, res, next) {
            var get_groups_url = 'http://127.0.0.1:8000/notification/get_groups';
            params = {'website': req.user.local.website}
            
            request({url: get_groups_url, qs: params}, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        groups = JSON.parse(body)['groups'];
                        if(groups.indexOf(req.body.group_name) == -1){
                            var url = 'http://127.0.0.1:8000/notification/generate_group';
                            request({url: url, qs: req.body}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body)
                            }
                            });
                            res.render('group_created.ejs');
                        }
                        else{
                            res.render('create_group.ejs',  
                                    { title: 'Create group', website: req.user.local.website, err_msg: '*group name already exists.' });
                        }
                    }
                    else{
                            res.render('create_group.ejs',  { title: 'Create group', website: req.user.local.website, err_msg: "" });
                    }
            });
            
        });
    
    //Push message
    app.post('/push', function(req, res){
        request.post(
            'http://127.0.0.1:8000/notification/send_notification',
            { form: req.body },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
        //res.send("Message successfully sent.");
        res.render('sent.ejs');
    })
    
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



