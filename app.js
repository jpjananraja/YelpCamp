var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
// var Campground = require("./models/campground");
// var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");




// mongoose.connect("mongodb://localhost/yelp_camp_v4"); //SINCE WE ARE HOSTING THIS APP ON HEROKU A LOCAL HOST WILL NOT SUFFICE

 mongoose.connect("mongodb://joseph:dredget56@ds011419.mlab.com:11419/joecamp");


// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
//         {name: "Granite Hill", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg"},
//         {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
//         {name: "Granite Hill", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg"},
//         {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
//         {name: "Granite Hill", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"}
//     ];


app.use(bodyParser.urlencoded({extended : true}));





//The following code aids the ejs files to be entered as arguments without the .ejs description on them.
//Example res.render("landing")  rather than res.render("landing.ejs")
app.set("view engine", "ejs");



app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));
app.use(flash());



// seedDB();


//==============================================================================
//PASSPORT CONFIGURATION
//==============================================================================
app.use(require("express-session")({
    secret: "Dhrashi kutti is my cutie pie!!!",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//TRY ADDING THE BELOW CODE ON ANY OTHER LOCATION ABOVE AND IT WOULDN'T WORK PROPERLY
//TO MAKE THE CURRENT USER OBJECT AVAILABLE TO ALL THE PAGES, DO THE FOLLOWING USING A MIDDLEWARE
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);




//==============================================================================
// //SCHEMA SETUP
//==============================================================================

// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });


// //Make a model that uses the above schema. Then use the model with the appropriate methods to find/replace objects
// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     // name: "Salmon Creek", 
//     // image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"
//     name: "Granite Hill", 
//     image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"
// }, 
// function(err, campground){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//     }
// });


// Campground.create({
//     // name: "Salmon Creek", 
//     // image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"
//     name: "Granite Hill", 
//     image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg",
//     description: "This is a huge Granite Hill. No bathrooms, no water. Just Beautiful Granite!"
// }, 
// function(err, campground){
//     if(err)
//     {
//         console.log(err);
//     }
//     else
//     {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//     }
// });





//==============================================================================
//ROUTES
//==============================================================================






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELPCAMP SERVER HAS STARTED!!!");
    
});