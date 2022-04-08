const  patientRouter = require('express').Router();
const crypto = require("crypto");
require('dotenv').config()

const Patient = require('../Models/patient')


module.exports = patientRouter;