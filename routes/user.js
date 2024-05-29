const express = require('express');
const { signUp, loginWithEmail, logout } = require('../controller/user.controller');

const router = express.Router();

router.post('/', signUp);
router.post('/login', loginWithEmail);
router.post('/logout', logout);

module.exports = router;
