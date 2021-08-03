const express = require('express')
const app = express()
//body-parser
var bodyParser = require('body-parser')
//lowdb
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json')
db = low(adapter)
//shorid 
var shortid = require('shortid')
//set some defaults (required if your JSON file is empty)
db.defaults({userslist: []})
  .write();

const port = 3000

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
  res.render('index.pug', {
    name: 'Long'
  });
}); 

app.get('/users', function(req, res) {
  res.render('users/search', {
    userslist: db.get('userslist').value()
  });
});

app.get('/users/search', function(req, res) {
  var q = req.query.q;
  var matchedusers = userslist.filter(function(user){
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  })
  res.render('users/search',{
    userslist: matchedusers,
    question: q
  })
});

app.get('/users/post', function(req, res) {
  res.render('users/create');
});

app.get('/users/:id', function(req, res){
  var id = req.params.id;
  var user = db.get('userslist').find({id: id}).value();
  res.render('users/view',{
    user: user
  })
})

app.use(express.static('public'))

app.post('/users/post', function(req, res) {
  req.body.id = shortid.generate()
  db.get('userslist').push(req.body).write();
  res.redirect('/users')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})