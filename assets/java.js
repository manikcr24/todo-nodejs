//var deleteTask = require('../delTask');

import deleteTask from '../delTask';

$(document).ready(function(){
	$('li').click(function(e){
		console.log('targer ID: '+e.target.id);
		deleteTask(e.target.id);
		console.log('retured to home,,...');
	});								
});