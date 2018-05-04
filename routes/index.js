var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");


//###############################################
// ROOT ROUT

router.get("/", function(req, res){
   res.render("landing"); 
});


//###############################################
// AUTH ROUTES

// show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});


// handle sign up logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to yelpCamp, " + user.username);
            res.redirect("/campgrounds"); 
       });
   }); 
});


// show login form
router.get("/login", function(req, res){
    res.render("login", {page: "register"});
});


// handle login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"    
    }), function(req, res){
});


// handle logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "bye " + req.body.username + ", see you soon");
    res.redirect("campgrounds");
});


//###############################################
// CATCH-ALL ROUT
//###############################################


router.get("*", function(req, res){
    res.send("404 - the site you are looking for is not available");
});


module.exports = router;