const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const cookieParser = require('cookie-parser');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mysql = require('mysql');

const favicon = require('serve-favicon')
  

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Passport config
require('./passport/passport')(passport);

// Set view
app.set("views", path.join(__dirname, "views"));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());



 //  app.use(expressValidator());

    app.use(express.static(path.join(__dirname, "public")));


const pool = mysql.createPool
     ({
       connectionLimit:8,     
       host     : '',
       user     : '',
       password : '',
       database : '',
       multipleStatements: true
     });
     
     app.get('/', function(req, res, next){
       
        const sql = 'SELECT * FROM tickets';
        const sql2 = 'SELECT * FROM lookingforG';
  
        pool.query(sql, (err,result) => {
        pool.query(sql2,(err,result2 ) =>{    

                res.render('home',{idk:result,hmm:result2});

        
                        })});
                        });



// Set session
app.use(session({
    
    secret: '',
    
    maxAge: 36000 * 5,
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash 
app.use(flash());


app.get('/lfg', (req, res) => {if(!req.isAuthenticated()) {
        res.redirect('/api/login');
    } else {
    res.render('lfg.ejs', { errors: [] });
}});
app.get('/ticket', (req, res) => {if(!req.isAuthenticated()) {
        res.redirect('/api/login');
    } else {
    res.render('ticket.ejs', { errors: [] });
}});



app.get('/', function(req, res){

  res.sendFile(__dirname + '/home.ejs');

})


// routes
app.use('/', require('./routes/view.route'));
app.use('/api', require('./routes/api.route'));
app.use('/',require('./routes/lfg'));
app.use('/',require('./routes/ticket'));



app.listen(3000);
