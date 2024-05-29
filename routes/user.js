const express = require('express');
const { signUp, loginWithEmail, logout, getMe } = require('../controller/user.controller');
const { authenticate } = require('../controller/auth.controller');

const router = express.Router();

router.post('/', signUp);
router.post('/login', loginWithEmail);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
