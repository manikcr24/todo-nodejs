var mongoose = require('mongoose');
const dbmodels = require('../models/dbmodels');
const userSchema = dbmodels.userSchema;
const taskSchema = dbmodels.taskSchema;

var user_info =  Model('user_info',userSchema);
var task_info = Model('task_info',taskSchema);

var saveTask = function(obj,res){
	mongoose.connect(MONGO_URL);
	var task={useremail: obj.user_email, task:obj.task};
	var item = task_info(task).save(function(err){
		if(err) throw err;
		console.log('TASK SAVED SUCCESSFULLY...\n');
	});
}
