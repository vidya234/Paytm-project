const express = require('express');

const route = express.Router();

const userRoute = require('./users');
const accountRoute = require('./account');

const cors = require('cors');
route.use('/user', userRoute);
route.use('/account', accountRoute);

module.exports = route;