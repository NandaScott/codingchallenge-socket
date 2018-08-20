const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');

const index = require('./routes/index');
const app = express();

app.use(index);

const PORT = process.env.PORT || 4001;

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const io = socketIo(server);

io.on('connection', (socket) => {

    // INIT
    axios.get('https://challengebackend.herokuapp.com/factory')
        .then((response) => {
            socket.emit('FromAPI', response.data);
        })
        .catch((error) => {
            io.emit('handleError', error.response.data);
        });


    socket.on('renameFactory', (data) => {
        axios.put(`https://challengebackend.herokuapp.com/factory/${data.factoryId}`, {'name': data.name})
            .then(() => {
                axios.get('https://challengebackend.herokuapp.com/factory')
                .then((response) => {
                    io.emit('renamedFactory', response.data);
                })
                .catch((error) => {
                    socket.emit('handleError', error.response.data);
                });
            })
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });
    });


    socket.on('generateNumbers', (data) => {
        axios.put(`https://challengebackend.herokuapp.com/factory/${data.factoryId}`,
            {
                'number_of_children': data.numberOfChildren,
                'name': data.name,
                'minimum': data.minimum,
                'maximum': data.maximum
            })
            .then(() => {
                axios.get('https://challengebackend.herokuapp.com/factory')
                    .then((response) => {
                        io.emit('generatedNumbers', response.data);
                    })
                    .catch((error) => {
                        socket.emit('handleError', error.response.data);
                    });
            })
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });
    });


    socket.on('deleteFactory', (data) => {
        axios.delete(`https://challengebackend.herokuapp.com/factory/${data.factoryId}`)
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });

        axios.get('https://challengebackend.herokuapp.com/factory')
            .then((response) => {
                io.emit('FromAPI', response.data);
            })
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });
    });


    socket.on('createFactory', (data) => {
        axios.post('https://challengebackend.herokuapp.com/factory',
            {'number_of_children': data.numberOfChildren, 'name': data.name})
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });

        axios.get('https://challengebackend.herokuapp.com/factory')
            .then((response) => {
                io.emit('FromAPI', response.data);
            })
            .catch((error) => {
                socket.emit('handleError', error.response.data);
            });
    });
});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));