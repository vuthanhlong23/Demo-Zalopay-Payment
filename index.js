const express = require('express')
const app = express()
//body-parser
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var userRoute = require('./routes/users.routes');
var authRoute = require('./routes/auth.routes');

var authMiddleware = require('./middlewares/auth.middleware');

const port = 3000

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.get('/', function(req, res) {
  res.render('index.pug', {
    name: 'Long'
  });
}); 

app.get('/cookies', function(req, res){
  res.cookie('user-id', '12345');
  res.send('Hello')
});


app.use(express.static('public'))

app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/auth',authRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})