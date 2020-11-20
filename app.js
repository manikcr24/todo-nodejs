var express =  require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var controllers = require('./controllers/controllers.js');

var findUser = controllers.findUser;
var getUserDocs = controllers.getUserDocs;
var saveTask = controllers.saveTask;
var deleteTask = controllers.deleteTask;

var deleteTask2 = controllers.deleteTask2;

var saveUser = controllers.saveUser;
var changepassword = controllers.changepassword;
var deleteUser = controllers.deleteUser;
var updateEmail = controllers.updateEmail;
var forgotPassword = controllers.forgotPassword;
var app = express();


app.use(bodyParser.urlencoded({ extended: false }));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: '1234@manik'
}));


app.get('/',function(req,res){
	res.render('index');
});


app.get('/forgot',function(req,res){
	res.render('forgot_password');
});


app.post('/forgot',function(req,res){
	console.log('Post request from FORGOT PASSWORD');
	forgotPassword(req,res);
});
app.set('view engine','ejs');
app.use(express.static('./assets'));

app.get('/login',function(req,res){
	res.render('login');
});


app.get('/signup',function(req,res){
	res.render('signup');
});

app.get('/settings',function(req,res){
	console.log('OPTIONS page loaded...');
	res.render('settings');
});

app.post('/login', urlencodedParser, function(req, res) {
	findUser(req.body.email, req.body.password, req, res);
});


app.post('/signup', urlencodedParser, function(req, res) {
	console.log(req.body);
	saveUser(req.body);
	res.send('<h1>Signup Succesfull...</h1>');
});

app.get('/home',function(req,res){
	getUserDocs(req, res);
});


/* app.post('/home', urlencodedParser, function(req, res) {
	console.log('POST request from HOME PAGE...');
	saveTask(req.body,res);
	//res.redirect('/home');
}); */

app.post('/home',urlencodedParser, function(req,res){
	console.log("POST request from home -- CReated new");
	saveTask(req,res);
});

/* app.delete('/home',function(req,res){
	console.log('This is a delete request from homepage');
	deleteTask2(req,res,data);
});
 */

app.get('/del',function(req,res){
	console.log('AJAX delete request...');
	deleteTask2(req,res);
});

app.get('/changepassword', function(req,res){
	console.log("GET request on CHANGEPASSWORD...\n\n");
	console.log();
	changepassword(req,res);
});

app.get('/updateemail',function(req,res){
	console.log("GET request - To update email id");
	updateEmail(req,res);
});

/* app.get('/delete/:id',function(req,res){
	console.log('DELETE REQUEST FROM BROWSER...',req.params.id);
	deleteTask(req.params.id,res);
}); */
 
app.get('/deleteuser',function(req,res){
	console.log("DELETE USER CALLED...,	");
	deleteUser(req,res);
});

app.get('/logout',function(req,res){
	req.session.destroy();
	console.log('Logged out...');
	res.redirect('/');
});

app.post('/edit',urlencodedParser, function(req, res){
  console.log('POST request form /edit');
  console.log(req.body.id);
});

app.listen('3000');
