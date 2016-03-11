
var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
    
    // res.send("This will be the landing page soon");
    res.render("landing");
    
});








//==============================================================================
//AUTH ROUTES
//==============================================================================


//SHOW REGISTER FORM
router.get("/register", function(req, res) {
   res.render("register"); 
});



//HANDLE SIGNUP LOGIC
router.post("/register", function(req, res) {
//   res.send("Signing you up"); 
    // var newUser = req.body.username;
    // var newPassword = req.body.password;
    
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log("Error found" + err);
            return res.render("register");
        }
        // passport.authenticate("local")(req,res, function(){
        //   res.redirect("/campgrounds"); 
        // });
        
        //ALTERNATE CODE TESTING TO THE ONE ABOVE WHICH HAS THE FUNKY SYNTAX
        var passAuth = passport.authenticate("local");
        passAuth(req, res, function(){
            res.redirect("/campgrounds"); 
            // console.log("This form of authentication also works i guess?");
        });

        
    });
});

//SHOW LOGIN FORM
router.get("/login", function(req, res){
   res.render("login"); 
});


//HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }) ,function(req, res) {
    // res.send("Login logic happened here");
});


//LOGOUT ROUTE
router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});




//MIDDLEWARE
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}




module.exports = router;