//###############################################
// INITIAL SETUP
//###############################################

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");
//    seedDB          = require("./seeds");


// requiring the route-files
var indexRoutes      = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// local db connection for development
// mongoose.connect("mongodb://localhost/yelp_db");
// db connection with mLab for production
mongoose.connect("mongodb://admin:password@ds159459.mlab.com:59459/yelpcamp");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); // has to be placed bevor passport configuration
//seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is a secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// own middleware which will be called on every rout (puts currentUser and message on every rout)
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


// use required routes parts of the path here, we can skip this part in the corresponding js-Files
// since we enter
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes); // has to be last or it causes problems with the catch-all route


//###############################################
// LISTEN SETUP
//###############################################


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running at " + process.env.IP + ":" + process.env.PORT);
});