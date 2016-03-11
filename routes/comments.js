
var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

 var middleware = require("../middleware");


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
router.get("/new", middleware.isLoggedIn ,function(req, res) {
    
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
router.post("/", middleware.isLoggedIn , function(req, res) {
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
                   req.flash("error", "Something went wrong");
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
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + theCampObj._id);
               }
           });
           
           
           
       }
   });
});


//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // res.send("EDIT ROUTE FOR COMMENT");
    
    //GET THE ID OF THE COMMENT
    Comment.findById(req.params.comment_id, function(err, theComment) {
        if(err)
        {
            res.redirect("back");
        }else{
             //GET THE ID OF THE CAMPGROUND THROUGH THE REQ
            var camp_id = req.params.id;
            res.render("comments/edit", {theCamp_id: camp_id, comment: theComment });
        }
    });
    
   
    
});


//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
//   res.send("YOU HIT THE UPDATE ROUTE"); 
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment)
    {
        if(err)
        {
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });
});


//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    // res.send("THIS IS THE DESTROY COMMENT ROUTE");
    
    Comment.findByIdAndRemove(req.params.comment_id, function(err)
    {
      if(err)
      {
          res.redirect("back");
      }else{
          req.flash("success", "Comment Deleted" );
          res.redirect("/campgrounds/" + req.params.id);
      }
    });
});




//MIDDLEWARE
// function isLoggedIn(req, res, next)
// {
//     if(req.isAuthenticated())
//     {
//         return next();
//     }
//     res.redirect("/login");
// }



// //MIDDLEWARE TO CHECK WHERE USER AUTHENTICATION AND AUTHORISATION
// function checkCommentOwnership(req, res, next)
// {
//     if(req.isAuthenticated())
//     {
//         //IF YES, THEN ...
//         //   res.send("EDIT COMMENT ROUTE"); 
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err)
//             {
//                  res.redirect("back");
//             }else{
//                 //...DOES USER OWN THE COMMENT?
//                 if(foundComment.author.id.equals(req.user._id))
//                 {
//                      next();  
//                 //   res.render("campgrounds/edit", {campground: foundCampGround}); 
//                 }else{
//                     // res.send("YOU DO NOT HAVE PERMISSION TO EDIT COMMENT");
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