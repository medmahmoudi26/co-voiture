//require packages
const express = require('express');
const BodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');

// declare app variable and connect to database
app = express();
var db = mongoose.connect('mongodb://localhost:27017/coVoiture');

//requrie models
const traget = require('./models/traget.js');

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
  res.render('index');
});
app.get('/index', function(req,res){
  res.render('index.ejs');
});
app.get('/proposer', function(req,res){
  res.render('proposer.ejs');
});
//POST
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
          res.render('found',{allant: allant,enretour: enretour, etape: etape});
        });
      });
    });
  }
});
app.post('/proposer', function(req,res){
  traget.create({
    nom: req.body.nom,
    prenom: req.body.prenom,
    depart: req.body.depart,
    etape: req.body.etape,
    dest: req.body.dest,
    allezDate: req.body.allezDate,
    retourDate: req.body.retourDate,
    places: req.body.places,
    email: req.body.email,
    num: req.body.num,
    facebook: req.body.facebook
  }, function(error, success){
    if (error) res.render('error', {error:error});
    res.render('success', {elmnt: success});
  });
});
//listen
console.log("listening on port 3000");
app.listen(3000);
