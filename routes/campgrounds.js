var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");

var middleware = require("../middleware");






//INDEX ROUTE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res) {
    
    // var campgrounds = [
    //     {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7503/15623542806_8058899c7d.jpg"},
    //     {name: "Granite Hill", image: "https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg"},
    //     {name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg"}
    // ];
    
    
    // console.log(req.user);
    
    
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allcampgrounds){
        if(err)
        {
            console.log(err);
        }
        // else
        // { //PASS THE CURRENT LOGGED IN USER INTO THE RENDERED PAGE
        //     res.render("campgrounds/index", {campsites : allcampgrounds, currentUser: req.user});
        // }
        else
        { //THANKS TO THE MIDDLEWARE DEFINED USING app.user(function(req, res, next){...}); NO NEED TO MANUALLY INSERT 
        // THE currentUser OBJECT LIKE IN THE IF STATEMENT ABOVE. THE currentUser IS AVAILABLE THROUGH THE MIDDLEWARE
            res.render("campgrounds/index", {campsites : allcampgrounds, currentUser: req.user});
        }
        
        
    });
    
    // res.render("campgrounds", {campsites : campgrounds});
    
    
});


//NEW ROUTE - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn , function(req, res) {
   res.render("campgrounds/new"); 
});



//CREATE ROUTE - ADD NEW CAMPGROUND TO DATABASE
router.post("/", middleware.isLoggedIn ,function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    
//   res.send("You hit the post route"); 

    var author = { 
        id: req.user._id,
        username: req.user.username
    };

    var newCampGroundObj = {name: name, image: image, description: description, author: author};
    
    // campgrounds.push(newCampGroundObj);
    
    //CREATE NEW CAMPGROUND AND SAVE TO THE DB
    Campground.create(newCampGroundObj, 
    function(err, newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log("NEWLY CREATED CAMPGROUND IS: " + newlyCreated);
            //NEW CAMPGROUND SUCCESSFULLY CREATED THEREFORE REDIRECT BACK TO CAMPGROUNDS PAGE
            res.redirect("/campgrounds");
        }
        
    });
    
        
    // res.redirect("/campgrounds");
});

 

// //SHOW ROUTE - TO DISPLAY INFORMATION ABOUT A PARTICULAR CAMP THAT WAS SELECTED
// app.get("/campgrounds/:id", function(req, res) {
//     //Find the campground with provided ID
//     var campID = req.params.id;
//     Campground.findById(campID, function(err, foundCampGround){
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             //Render show template with that campground
//             res.render("show", {thecampground: foundCampGround});
//         }
//     });
    
//     // //Render show template with that campground
//     // res.render("show");
//     // res.send("THIS WILL BE THE SHOW PAGE ONE DAY");
// })


//SHOW ROUTE - TO DISPLAY INFORMATION ABOUT A PARTICULAR CAMP THAT WAS SELECTED
router.get("/:id", function(req, res) {
    //Find the campground with provided ID
    var campID = req.params.id;
    Campground.findById(campID).populate("comments").exec(function(err, foundCampGround){
        if(err)
        {
            console.log(err);
        }
        else
        {
            //Render show template with that campground
            res.render("campgrounds/show", {thecampground: foundCampGround});
        }
    });
    
    // //Render show template with that campground
    // res.render("show");
    // res.send("THIS WILL BE THE SHOW PAGE ONE DAY");
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    
        Campground.findById(req.params.id, function(err, foundCampGround){
           
                   res.render("campgrounds/edit", {campground: foundCampGround}); 
        });
});






//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //FIND AND UPDATE THE CORRECT CAMPGROUND USING THE ID
   Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
       if(err)
       {
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});



//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err)
       {
           res.redirect("/campgrounds");
       }
       else
       {
           res.redirect("/campgrounds");
       }
   });
});



// MIDDLEWARE
// function isLoggedIn(req, res, next)
// {
//     if(req.isAuthenticated())
//     {
//         return next();
//     }
//     res.redirect("/login");
// }


// //MIDDLEWARE TO CHECK WHERE USER AUTHENTICATION AND AUTHORISATION
// function checkCampgroundOwnership(req, res, next)
// {
//     if(req.isAuthenticated())
//     {
//         //IF YES, THEN ...
//         //   res.send("EDIT CAMPGROUND ROUTE"); 
//         Campground.findById(req.params.id, function(err, foundCampGround){
//              if(err)
//             {
//                  res.redirect("back");
//             }else{
//                 //...DOES USER OWN THE CAMPGROUND?
//                 if(foundCampGround.author.id.equals(req.user._id))
//                 {
//                      next();  
//                 //   res.render("campgrounds/edit", {campground: foundCampGround}); 
//                 }else{
//                     // res.send("YOU DO NOT HAVE PERMISSION TO EDIT CAMPGROUND");
//                     res.redirect("back");
//                 }
                
                 

//             }  
         
//         });
        
//     }else{
//         //IF NOT THEN REDIRECT
//         res.redirect("back");
//     }
    
// }











module.exports = router;