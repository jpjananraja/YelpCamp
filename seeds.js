var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require('./models/comment');


// Campground.remove({}, function(err){
//     if(err)
//     {
//         console.log("Error found in removing all objects");
//     }
//     console.log("REMOVED CAMPGROUNDS");
    
// });

//Default camp data
var data = [
    {name:"Segue Mount", image:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTbnw_BaohtCngtA2acuaGmrq3q5k1lokOCGlvFzzdGaPZNyrnySQ", description:"Gorgeous Mountain top"},
    {name:"Mountain Grass", image:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ3jqcaLi-wrpAoMO1efSS9Li0GLPsbpmpPhf1nSj9LF4i5q82A", description:"The Marriot of views"},
    {name:"Segue Mount", image:"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6jQSj0hLHrfulPg60BunKLhs2oNjNGa2OV6uDBz18o_HnYMXn", description:"Specatucal greenery"},
    {name:"Panora Grass", image:"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS7GIZrjeiRIe2-GnD6IMOuU6v4Qp5Zi_bCFwS_LqfO7ANbQvZNpg", description:"Green Grassy Fields"}
    
    ];

// function seedDB(){
//     //Remove all Campgrounds
//     Campground.remove({}, function(err){
//     if(err)
//     {
//         console.log("Error found in removing all objects");
//     }
//     console.log("REMOVED CAMPGROUNDS");
    
//     });
    
//     //add a few campgrounds
//     data.forEach(function(seedCamp){
//         Campground.create(seedCamp, function(err, createdCamp){
//             if(err)
//             {
//                 console.log(err);
//             }
//             else
//             {
//                 console.log("aaded a campground");
//             }
//         });
        
//     });
    
    
//     //add a few comments 
    
    
// }



function seedDB(){
    //Remove all Campgrounds
    Campground.remove({}, function(err){
    if(err)
    {
        console.log("Error found in removing all objects");
    }
    console.log("REMOVED CAMPGROUNDS");
    //add a few campgrounds
        data.forEach(function(seedCamp){
            Campground.create(seedCamp, function(err, createdCamp){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("aaded a campground");
                    
                    //Create a Comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) 
                            {
                                if(err)
                                {
                                    console.log(err);
                                    
                                }
                                else
                                {
                                    createdCamp.comments.push(comment);
                                    createdCamp.save();
                                    console.log("Created new comment");
                                }
                            }
                        
                    );
                }
            });
        
        });
    
    });
    
    //Due to callbacks the above code can run and finish before the "remove" code. Therefore the code below is moved inside of the remove function
    // //add a few campgrounds
    // data.forEach(function(seedCamp){
    //     Campground.create(seedCamp, function(err, createdCamp){
    //         if(err)
    //         {
    //             console.log(err);
    //         }
    //         else
    //         {
    //             console.log("aaded a campground");
    //         }
    //     });
        
    // });
    
    
    
    
    
}






module.exports = seedDB;