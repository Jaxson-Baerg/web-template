const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const createError = require('http-errors');
const logger = require('morgan');
const chalk = require('chalk');

// Import route files
const homeRouter = require('./routes/home');
const adminRouter = require('./routes/admin');

const app = express();

// Allow client to access the icon
app.get('/public/images/:image_url', (req, res) => {
    res.sendFile(__dirname + `/public/images/${req.params.image_url}`);
});

app.use(express.static('public'));

// View engine setup
app.set('view engine', 'ejs');

app.use(logger('dev')); // Logs requests to the server
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys:['key1', 'key2', 'key3'],
    maxAge: 30 * 24 * 60 * 60 * 1000 // 24 hours
}));

// Set routes by incoming url
app.use('/', homeRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.redirect('/');
    } else {
        // Set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // Render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});

app.get('*', () => {
    try {
        res.redirect('/');
    } catch(err) {
        console.log(chalk.red.bold(`Error (${err.status}): `) + " " + err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
