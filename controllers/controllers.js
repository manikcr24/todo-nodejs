const mongoose = require('mongoose');
const dbmodels = require('../models/dbmodels');
const userSchema = dbmodels.userSchema;
const taskSchema = dbmodels.taskSchema;
var Schema = mongoose.Schema;
var Model = mongoose.model;


//***********************************************************************

var user_info =  Model('user_info',userSchema);
var task_info = Model('task_info',taskSchema);


var saveTask =  function(req,res){
	mongoose.connect(MONGO_URL);
	var task = {task: req.body.task, useremail: req.body.user_email};

	task_info(task).save(function(err,todo){
		if(err){
			console.log("ERRER...Hihihi");
		}
		console.log('TASK SAVED SUCCESSFULLY...\n',todo);
		res.json(todo);
	});
}


var saveUser =  function(user){
	console.log('dbsave called...');
	mongoose.connect(MONGO_URL);
	var userDetails={
		name: user.name,
		email: user.email,
		phone: user.phone,
		password: user.password,
		securityQuestion: user.securityQuestion,
		securityAnswer: user.securityAnswer
	};

	var itemOne = user_info(userDetails).save(function(error){
			if(error) throw error;
			console.log('Item saved successfully...');
	});
}



var deleteTask2 = function(req,res){
	mongoose.connect(MONGO_URL);
	console.log("DELETE REQUEST is now under Controllers.", req.query.id);

	task_info.findOneAndDelete({_id:req.query.id}).then(function(result){
		console.log('DELETED..\n '+result);
		var email = result.useremail;
		var html='';
		var ress = task_info.find({useremail: email},function(err,tasks){
		if(err) throw err;
		//console.log('results generated...\n'+tasks);
		for(var i in tasks){
			html += ' <h2><div class=\"task_class\" id='+tasks[i].id+'>'+ tasks[i].task +'<button class="btn btn-danger delete_buttons" pid=' +tasks[i].id+ '> Delete </button>';
			html += "<span class='input-group-btn'> <input class='btn btn-primary' id='<%=tasks[i].id%>' name='editTask' onclick=\"editTask('<%=tasks[i].id%>')\" type='submit' value='Edit'/>";
			html += '<input class="form-control" name="editTask_text_box" type="text" type="hidden"/></span>';

		}
		res.send(html);
	  });
    });
}


var deleteUser = function(req,res){
	console.log("Now into controllers.deleteUser "+req);
	console.log(req.query);
	mongoose.connect(MONGO_URL);

	// first delete all tasks of the user

	task_info.deleteMany({useremail:req.query.email}).then(function(err,result){
		if(err) console.log(err);
		console.log('DELETED..\n '+result);

		user_info.findOneAndDelete({email:req.query.email},function(err,result){
			if(err){
				console.log(err);
			}
			console.log('deleted account successfully...');
			console.log(result);
	    });

	});
}


var getUserDocs = function(req, res) {
	console.log("GETUSERDOCS CALLED...");
	if(req.session.useremail == undefined){
		console.log('INVALID USER...');
		//alert('Please login');
		res.render('invaliduser',{res:res});
		return;
		//res.redirect('/login');
	}

	task_info.find({useremail:req.session.useremail},function(err,result){
		if(err) throw err;
		res.render('home',{tasks:result,userdetails:{username:req.session.username,useremail:req.session.useremail}});
	});
}

var findUser = function(email,password,req, res){
	mongoose.connect(MONGO_URL);
	user_info.findOne({email:email,password:password}, function(err,result){
		if(err) throw err;

		if(result!=null){
			req.session.username = result.name;
			req.session.useremail= result.email;
			res.redirect('/home');
		}
		else
			res.send("<h1>No such user</h1>");
	});
}

var changepassword = function(req,res){
	console.log("NOW INTO CONTROLLERS...");
	console.log(req.session.username+' ---- '+req.session.useremail);
	mongoose.connect(MONGO_URL);
	//var user = req.session.username;
	//var email =req.session.useremail;
	console.log(req.query.email+' ====== '+req.query.password);
	user_info.findOneAndUpdate({email:req.query.email},{password:req.query.password},function(){
		console.log('\n\nsuccess-.');
	});
}

var updateEmail = function(req,res){
	console.log('Now into the controllers...');
	mongoose.connect(MONGO_URL);
	user_info.findOneAndUpdate({email:req.query.email},{email:req.query.new_email},function(){
		console.log("Updating email "+req.query.email+" with "+req.query.new_email+" ");
	});
}



var forgotPassword = function(req,res){
	console.log("Now into the CONTROLLERS @forgotPassword");
	console.log(req.body);
	var user = req.body;
	mongoose.connect(MONGO_URL);
	var name = user.name;
	var email = user.email;
	var securityQuestion = user.securityQuestion;
	var securityAnswer = user.answer;

	var actualUser = user_info.findOne({email:email}, function(err, user){
		if(err){
			res.send("You are not a valid user");
		}
		console.log(user);
		var actualSecurityQuestion = user.securityQuestion;
		var actualSecurityAnswer = user.securityAnswer;
		if(securityQuestion == actualSecurityQuestion && securityAnswer == actualSecurityAnswer){
			res.send("<h2>Your password is </h2>"+"<h1> "+user.password +" </h1>");
		}
		else{
			res.send("You are not a valid user");
		}
	});

}


module.exports = {
		findUser:findUser,
		getUserDocs:getUserDocs,
		deleteTask2:deleteTask2,
		saveTask:saveTask,
		saveUser:saveUser,
		changepassword:changepassword,
		deleteUser: deleteUser,
		updateEmail: updateEmail,
		forgotPassword: forgotPassword
};
