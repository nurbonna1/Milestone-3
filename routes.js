const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Your DB connection

// Registration Page
router.get('/register', (req, res) => {
  res.render('register');
});

// Registration POST
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.send('Username already taken.');
    res.redirect('/auth/login');
  });
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.send('Invalid login.');
    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.send('Invalid login.');

    req.session.user = {
      username: results[0].username,
      admin: results[0].Administrator
    };
    res.redirect('/');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Profile Management
router.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  res.render('profile', { user: req.session.user });
});

router.post('/profile', (req, res) => {
  const { address, profile_picture } = req.body;
  db.query('UPDATE Users SET address = ?, profile_picture = ? WHERE username = ?', [address, profile_picture, req.session.user.username], (err) => {
    res.redirect('/auth/profile');
  });
});

module.exports = router;



router.post('/profile', async (req, res) => {
  const { password, address, profile_picture } = req.body;
  const username = req.session.user.username;

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    db.query('UPDATE Users SET password = ?, address = ?, profile_picture = ? WHERE username = ?', 
      [hashed, address, profile_picture, username], (err) => {
      if (err) return res.send('Database error.');
      res.redirect('/auth/profile');
    });
  } else {
    db.query('UPDATE Users SET address = ?, profile_picture = ? WHERE username = ?', 
      [address, profile_picture, username], (err) => {
      if (err) return res.send('Database error.');
      res.redirect('/auth/profile');
    });
  }
});

