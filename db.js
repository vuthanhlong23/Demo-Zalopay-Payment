//lowdb
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json')
db = low(adapter)

//set some defaults (required if your JSON file is empty)
db.defaults({userslist: []})
  .write();

module.exports = db;