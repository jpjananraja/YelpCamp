var mongoose = require("mongoose");


//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" //name of the model
        }
    ]
});


//Make a model that uses the above schema. Then use the model with the appropriate methods to find/replace objects
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;