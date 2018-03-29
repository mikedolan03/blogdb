'use strict';

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema ({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {type: String, required: true},
	created: {type: Date, required: true}

});

blogPostSchema.virtual('authorObj').get(function() {

	let author = this.author;
	let authorArray = author.split(" ");

	let authorObject = { 
		firstname: authorArray[0],
		lastname: authorArray[1]
	};

  return authorObject;

});


blogPostSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.author,
    created: this.created
  };
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};