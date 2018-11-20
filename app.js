var fs = require('fs')
const https = require('https')
const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookiehandler = require("./config/cookiehandler.js");
const  bodyParser =require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');




const app = express();
app.use(express.static(__dirname + '/public'));
// set view engine
app.set('view engine', 'ejs');


cookiehandler(app)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());


app.use(flash());
app.use(function(req, res, next){
	res.locals.success_message = req.flash('success_message');
	res.locals.error_message = req.flash('error_message');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
  	next();
});

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodb.dbURI,{
    useMongoClient: true
  });

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

const port = process.env.PORT || 3030;
https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }, app).listen(port);
