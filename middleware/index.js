var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

// MIDDLEWARE

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "campground not found");
                res.redirect("back");
            } else {
                // does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "you don't have the permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "please login to continue");
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "comment not found");
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "you don't have the permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "please login to continue");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please login to continue")
    res.redirect("/login");
};

module.exports = middlewareObj;