'use strict';

const mongoose = require('mongoose');

//author not a string - can we use object

const blogPostSchema = mongoose.Schema ({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
			firstName: String,
			lastName: String
		},
	created: {type: Date, required: true}

});

blogPostSchema.virtual('authorName').get(function() {

	
  return `${this.author.firstName} ${this.author.lastName}`;

});


blogPostSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created
  };
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};