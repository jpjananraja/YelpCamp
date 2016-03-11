
var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");


//==============================================================================
//   COMMENT ROUTES
//==============================================================================

//THE OLD COMMENTS ROUTE WITHOUT A MIDDLEWARE TO CHECK WHETHER USER IS SIGNED IN
// app.get("/campgrounds/:id/comments/new", function(req, res) {
//   //Find campground by id
//   Campground.findById(req.params.id, function(err,theCampObj){
//       if(err)
//       {
//           console.log(err);
//       }
//       else
//       {
//           //render the new.ejs file
//           res.render("comments/new", {theCamp: theCampObj}); 
//       }
       
       
//   });
// //   res.render("comments/new");
    
// });



//THE OLD POST COMMENTS ROUTE WITHOUT THE MIDDLEWARE. SECURITY ISSUE SINCE USING POSTMAN SOFTWARE HACKERS CAN SEND COMMENTS

// app.post("/campgrounds/:id/comments", function(req, res) {
//   //lookup campground using id
//   Campground.findById(req.params.id, function(err, theCampObj) {
//       if(err)
//       {
//           console.log(err);
//           res.redirect("/campgrounds");
//       }
//       else
//       {
//           //create new comment
//           // console.log(req.body.comment);
//           Comment.create(req.body.comment, function(err, newComment){
//               if(err)
//               {
//                   console.log(err);
//               }
//               else
//               {
//                     //connect new comment to campground
//                     theCampObj.comments.push(newComment);
//                     theCampObj.save();
                    
//                     //redirect back to show page of the campground
//                     res.redirect("/campgrounds/" + theCampObj._id);
//               }
//           });
           
           
           
//       }
//   })
// });



//MODIFIED COMMENTS ROUTE TO CHECK WHETHER USER IS SIGNED IN THROUGH THE AID OF A MIDDLEWARE DEFINED BELOW
router.get("/new", isLoggedIn ,function(req, res) {
    
    // console.log(req.params.id);
    
   //Find campground by id
   Campground.findById(req.params.id, function(err,theCampObj){
       if(err)
       {
           console.log(err);
       }
       else
       {
           //render the new.ejs file
           res.render("comments/new", {theCamp: theCampObj}); 
       }
       
       
   });
//   res.render("comments/new");
    
});



//MODIFIED POST COMMENTS ROUTE TO CHECK WHETHER USER IS SIGNED IN THROUGH THE AID OF A MIDDLEWARE DEFINED BELOW
router.post("/", isLoggedIn , function(req, res) {
   //lookup campground using id
   Campground.findById(req.params.id, function(err, theCampObj) {
       if(err)
       {
           console.log(err);
           res.redirect("/campgrounds");
       }
       else
       {
           //create new comment
           // console.log(req.body.comment);
           Comment.create(req.body.comment, function(err, newComment){
               if(err)
               {
                   console.log(err);
               }
               else
               {
                    //Add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    
                    //save comment
                    newComment.save();
                    
                    
                    //connect new comment to campground
                    theCampObj.comments.push(newComment);
                    theCampObj.save();
                    
                    //redirect back to show page of the campground
                    res.redirect("/campgrounds/" + theCampObj._id);
               }
           });
           
           
           
       }
   });
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