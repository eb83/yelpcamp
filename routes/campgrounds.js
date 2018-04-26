var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"); // the index file in aa directory is automatically required


// INDEX ROUTE (shows all given resources)
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});


// CREATE ROUTE (adds a new resource to db)
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    // create a new campground and save it to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash("error", "something didn't work, please try again");
            console.log(err);
        } else {
            req.flash("success", "campground successfully created");
            res.redirect("/campgrounds");
        }
    });
});


// NEW ROUTE (shows the form to add a new campground)
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


// SHOW ROUT (shows details for a specific resource)
// has to be placed after NEW ROUTE or else /new would be treated like /:id. 
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "campground not found");
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "campground not found");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "campground successfully edited");
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});


// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "campground not found");
            res.redirect("/");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "campground not found");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "campground successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;