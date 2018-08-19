const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    axios.get('http://localhost:8000/factory')
        .then((response) => {
            res.send({response: 'I am alive.'}).status(200);
        })
        .catch((error) => {
            res.send(error.response.message);
        });
});

module.exports = router;