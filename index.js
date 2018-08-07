//require packages
const express = require('express');
const BodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');

// declare app variable and connect to database
app = express();
var db = mongoose.connect('mongodb://localhost:27017/coVoiture');

//session
app.use(session({secret:'cocar'}));

//requrie models
const traget = require('./models/traget.js');
const user = require('./models/user.js');

//set app and requirements
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(BodyParser.urlencoded());
app.use(BodyParser.json());
app.use(session({secret: 'covoiture'}));

// ***** routes *****

 // GET REQUESTS
//index
app.get('/', function (req,res) {
  console.log(req.session);
  rmredire(req,res);
  if (req.session.user){
  res.render('index',{user: req.session.user});
}else {
  res.render('index');
}
});
app.get('/index', function(req,res){
  rmredire(req,res);
  if (req.session.user){
  res.render('index',{user: req.session.user});
}else {
  res.render('index')
}
});
//propser
app.get('/proposer', function(req,res){
  rmredire(req,res);
  if (!req.session.user){
    req.session.redire = '/proposer';
    res.redirect('/notlogged');
  }else {
    res.render('proposer.ejs', {user:req.session.user});
  }
});
//login
app.get('/login', function(req,res){
  rmredire(req,res);
  if(!req.session.user){
  res.render('login');
}else {
  res.redirect('/profile');
}
});
//register
app.get('/register', function(req,res){
  rmredire(req,res);
  if (req.session.user){
    res.redirect('/');
  }
  res.render('register');
});
//profile of another user
app.get('/detail/:id', function(req,res){
  rmredire(req,res)
  user.findOne({_id:req.params.id}, function(error,result){
    if(error) {
      res.render('error', {error:"le profil que vous chercher n'existe pas"});
    }else {
      res.render('details', {user:result});
    }
  });
});
//show my profile
app.get('/profile', function (req,res) {
  rmredire(req,res);
  console.log(req.session.user);
  if (req.session.user){
    res.render('profile', {user:req.session.user});
  }else {
    req.session.redire = '/profile';
    res.redirect('/notlogged');
  }
});
app.get('/notlogged', function(req,res){
  res.render('notlogged.ejs')
});

//logoff
app.get('/logoff', function(req,res){
  req.session.destroy();
  res.redirect('/')
});
// POST REQUESTS

//chercher un traget
app.post('/chercher', function(req,res){
  if(req.body.depart && req.body.dest && req.body.date){
    traget.find({
      depart: req.body.depart,
      dest: req.body.dest,
      allezDate: req.body.date
    }, function(error, allant){
      if (error) res.render('error', {error: error});
      traget.find({
        depart: req.body.dest,
        dest: req.body.depart,
        retourDate: req.body.date
      },function(error, enretour){
        if (error) res.render('error',{error: error});
        traget.find({
          etape: req.body.depart,
          dest: req.body.dest,
          allezDate: req.body.date
        }, function (error, etape) {
          if (error) res.render('error',{error: error});
          if (req.session.user){
            res.render('found',{allant: allant,enretour: enretour, etape: etape, user:req.session.user});
          }else {
            res.render('found',{allant: allant,enretour: enretour, etape: etape});
          }
        });
      });
    });
  }
});

// proposer un traget
app.post('/proposer', function(req,res){
  traget.create({
    _id: req.session.user._id,
    nom: req.session.user.nom,
    prenom: req.session.user.prenom,
    depart: req.body.depart,
    etape: req.body.etape,
    dest: req.body.dest,
    allezDate: req.body.allezDate,
    retourDate: req.body.retourDate,
    places: req.body.places,
    email: req.session.user.email,
    num: req.session.user.number,
    facebook: req.session.user.facebook
  }, function(error, success){
    if (error) res.render('error', {error:error});
    res.render('success', {elmnt: success});
  });
});

//login
app.post('/login', function(req,res){
  if (req.body.submit){
    user.findOne({
      email: req.body.email,
    }, function(error,user){
      if (error) res.render('error', {error:error});
      if (user.pass == req.body.pass) {
        req.session.user = user;
        if (req.session.redire){
          console.log("[+] redirection: "+req.session.redire)
          res.redirect(req.session.redire);
        }else {
          res.redirect('/profile');
        }
      }else {
        res.render('notlogged',{ps:"ces coordonnés sont fausses, réessayez"});
      }
    });
    };
  });

//register
app.post('/register', function(req,res){
  if (req.body.pass == req.body.confirm){
    user.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      pass: req.body.pass,
      year: req.body.year,
      number: req.body.number,
      facebook: req.body.facebook
    }, function(error, user){
      if (error){ res.render('register', {ps:"email already used"});}
      else {
        req.session.user = user;
        res.redirect('/profile');
      }
    });
  }else {
  res.render('register', {ps:"please confirm your password carefully"});
  }
});
//update profile
app.post('/update', function (req,res) {
  if (req.body.submit){
    traget.findOneAndupdate
  }
});
//use this function with get requests to verifie
//if user already logged in
function auth(req,res) {
  if (!req.session.user){
    res.redirect('/notlogged');
  }
}
//function to delete the redirect to session
function rmredire(req,res){
  if (req.session.redire){
    delete req.session.redire;
  }
}

//listen
console.log("listening on port 3000");
app.listen(3000);
