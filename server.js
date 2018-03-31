'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { BlogPost } = require('./models');

const app = express();
app.use(bodyParser.json());


//GET Method

app.get('/blog-posts', (req, res) => {

	BlogPost
		.find()
		.limit(15)
		.then(blogposts => { 
			res.json({
				blogposts: blogposts.map (
					(blogpost) => blogpost.serialize())
			});
		} )
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error'});
		});

});

//post
app.post('/blog-posts', (req, res) => {

	const requiredFields = [];

	BlogPost
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author,
			created: req.body.created
		})
		.then(blogpost => res.status(201).json(blogpost.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error'});
		});

});
//delete

//put / update



//--------------------------------server code--------------------------------------

let server;

function runServer(databaseUrl, port= PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`App listening on port ${port}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
