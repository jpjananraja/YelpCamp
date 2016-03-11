//ALL THE MIDDLEWARE GOES HERE
var Campground = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};


middlewareObj.checkCommentOwnership = function(req, res, next)
{
     if(req.isAuthenticated())
    {
        //IF YES, THEN ...
        //   res.send("EDIT COMMENT ROUTE"); 
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err)
            {
                 res.redirect("back");
            }else{
                //...DOES USER OWN THE COMMENT?
                if(foundComment.author.id.equals(req.user._id))
                {
                     next();  
                //   res.render("campgrounds/edit", {campground: foundCampGround}); 
                }else{
                    // res.send("YOU DO NOT HAVE PERMISSION TO EDIT COMMENT");
                    req.flash("error", "You don't have permission to edit comment");
                    res.redirect("back");
                }
                
                 

            }  
         
        });
        
    }else{
        //IF NOT THEN REDIRECT
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
    
};


middlewareObj.checkCampgroundOwnership = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        //IF YES, THEN ...
        //   res.send("EDIT CAMPGROUND ROUTE"); 
        Campground.findById(req.params.id, function(err, foundCampGround){
             if(err)
            {
                 req.flash("error", "Campground not found");
                 res.redirect("back");
            }else{
                //...DOES USER OWN THE CAMPGROUND?
                if(foundCampGround.author.id.equals(req.user._id))
                {
                     next();  
                //   res.render("campgrounds/edit", {campground: foundCampGround}); 
                }else{
                    // res.send("YOU DO NOT HAVE PERMISSION TO EDIT CAMPGROUND");
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
                
                 

            }  
         
        });
        
    }else{
        req.flash("error", "You need to be logged in to do that!");
        //IF NOT THEN REDIRECT
        res.redirect("back");
    }
    
};




middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};


module.exports = middlewareObj;