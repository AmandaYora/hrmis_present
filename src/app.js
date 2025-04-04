const express = require('express');
const app = express();
const cookieRoute = require('./routes/cookie.route');

app.use(express.json());
app.use('/cookie', cookieRoute);

module.exports = app;
