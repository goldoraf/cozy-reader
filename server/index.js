const PouchDB = require('pouchdb')
const DbPouchDB = PouchDB.defaults({prefix: __dirname + '/db/'});
const express = require('express')
const app = express()

app.use('/db', require('express-pouchdb')(DbPouchDB))
app.use(express.static('../'))

app.listen(3000, () => console.log('Now listening on port 3000'))
