const express = require('express');
const router = express.Router();
const { getCookieAndFetchData } = require('../controllers/cookie.controller');

router.get('/fetch', getCookieAndFetchData);

module.exports = router;
