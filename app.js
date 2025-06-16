const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'super_secret_key',
  resave: false,
  saveUninitialized: true
}));

global.db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'pokemon_comparator'
});

app.use('/auth', require('./routes/auth'));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


app.use('/admin', require('./routes/admin'));
