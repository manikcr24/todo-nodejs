const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model;
mongoose.connect(MONGO_URL);

var userSchema = new Schema({
		name: String,
		email: String,
		password: String,
		phone: String,
		securityQuestion: String,
		securityAnswer: String
	});
	

var taskSchema = new Schema({
	useremail: String,
	task: String
});


module.exports = {userSchema:userSchema, taskSchema:taskSchema};