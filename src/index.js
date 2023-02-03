const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/serverConfig');
const ApiRoutes = require('./routes/index');

const createAndStartServer = () => {
    const app = express();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', ApiRoutes);

    app.listen(PORT,() => {
        console.log(`Server started on PORT: ${PORT}`);


    });
}

createAndStartServer();