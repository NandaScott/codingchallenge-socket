const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.send({message: "I am alive"}).status(200);
});

module.exports = router;