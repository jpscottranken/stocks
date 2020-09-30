//  Declare Dependencies
const express = require('express');
const handlebars = require('express-handlebars');
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');

//  Instantiate Express
const app = express();

//  Set port number
const PORT = process.env.PORT || 5000;

// use body parser middleware
app.use(bodyParser.urlencoded({extended: false}));

//  Set view engine
app.set('view engine', 'hbs');

//  Set configurations
app.engine('hbs', handlebars ({
    layoutsDir: __dirname + '/views/layouts',
    extname:    'hbs'
}));

//  Define static assets folder
app.use(express.static('public'));

// create call_api function
function call_api(finishedAPI, name) {
	request('https://cloud.iexapis.com/stable/stock/' + 
			name + '/quote?token=pk_c2f1508999a74ae59bdbbdaf7d3f349f', 
			{ json: true }, (err, res, body) => {
				if (err) {
					return console.log(err);
				}
	
				if (res.statusCode === 200) {
					finishedAPI(body);
				}
	});
};

// Set handlebar index GET route
app.get('/', function (req, res) {
	call_api(function(doneAPI) {
			res.render('index', {
	    	stock: doneAPI,
    	});
	}, "fb");
		
});

// Set handlebar index POST route
app.post('/', function (req, res) {
	call_api(function(doneAPI) {
			res.render('index', {
	    	stock: doneAPI
    	});
	}, req.body.stockName);		
});

//  Render About Page
app.get('/about', (req, res) => {
    res.render('about', {title:   'Welcome to the about page!'});
});

//  Render Contact Page
app.get('/contact', (req, res) => {
    res.render('contact', {title:   'Welcome to the contact page!'});
});

//  File Not Found Page
app.get('*', (req, res) => {
    res.render('filenotfound', {title:   'Sorry, File Not Found!'});
});

app.listen(PORT, () => {
    console.log(`App now running on port ${PORT}`);
});