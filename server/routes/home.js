const express = require('express');
const router = express.Router();
const chalk = require('chalk');

// Render the home page with class types list displayed
router.get('/', async (req, res) => {
    try {
        res.render('../../client/views/pages/home', { message: undefined });
    } catch(err) {
        console.log(chalk.red.bold(`Error (${err.status}): `) + " " + err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
