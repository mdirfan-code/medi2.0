const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()


app.use(cors());
app.use(express.json());

const authentication = require('./Routes/authentication.route')
const patient = require('./Routes/patient.route')

mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log(`MongoDB connected on Database ${result.connection.name} with models:`)
        console.log(result.models)
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/api/auth/',authentication)
app.use('/api/',patient)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`)
})