const express = require('express')
const app = express()
//body-parser
var bodyParser = require('body-parser')

var userRoute = require('./routes/users.routes');

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

app.use(express.static('public'))

app.use('/users',userRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})