const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please enter a title"],
    },
    content:{
        type: String,
        required: [true, "Please enter the content"],
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
});

module.exports = mongoose.model("Blog", blogSchema);