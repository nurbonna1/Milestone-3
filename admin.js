const express = require('express');
const router = express.Router();
const db = require('../db'); 

// Middleware to check admin access
function isAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.admin) {
    return res.redirect('/');
  }
  next();
}

router.get('/', isAdmin, (req, res) => {
  db.query('SELECT username, Administrator FROM Users', (err, users) => {
    if (err) return res.send('Database error.');
    res.render('admin', { users, currentUser: req.session.user });
  });
});

// Promote user to admin
router.post('/promote/:username', isAdmin, (req, res) => {
  const username = req.params.username;
  db.query('UPDATE Users SET Administrator = TRUE WHERE username = ?', [username], (err) => {
    res.redirect('/admin');
  });
});

// Demote user from admin
router.post('/demote/:username', isAdmin, (req, res) => {
  const username = req.params.username;
  db.query('UPDATE Users SET Administrator = FALSE WHERE username = ?', [username], (err) => {
    res.redirect('/admin');
  });
});

module.exports = router;
