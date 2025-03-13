const express = require('express');
const router = express.Router();
const chalk = require('chalk');

require('dotenv').config();

// Render the admin page if the admin password has been given, with all class types
router.get('/', async (req, res) => {
    try {
        if (req.session.admin) {
            res.render('../../client/views/pages/admin', { message: undefined });
        } else {
            res.redirect('/admin/login');
        }
    } catch(err) {
        console.log(chalk.red.bold(`Error (${err.status}): `) + " " + err.message);
        res.status(500).json({ error: err.message });
    }
});

// Render the admin login page to enter the password stored in the .env file
router.get('/login', async (req, res) => {
    try {
        if (!req.session.admin) {
            res.render('../../client/views/pages/admin_login', { message: undefined });
        } else {
            res.redirect('/admin');
        }
    } catch(err) {
        console.log(chalk.red.bold(`Error (${err.status}): `) + " " + err.message);
        res.status(500).json({ error: err.message });
    }
});

// Create the admin session cookie
router.post('/login', async (req, res) => {
    try {
        if (req.body.password === process.env.ADMIN_PASS) {
            req.session.admin = true;
            res.redirect('/admin');
        } else {
            req.session.history = updateHistory(req.session.history, 'admin/login');
            res.render('../../client/views/pages/admin_login', { user: req.session.user, message: "Password incorrect."})
        }
    } catch(err) {
        console.log(chalk.red.bold(`Error (${err.status}): `) + " " + err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
