const  searchRouter = require('express').Router();
const crypto = require("crypto");
require('dotenv').config()

const Patient = require('../Models/patient')
const Hospital = require('../Models/hospital')
const Doctor = require('../Models/doctor')



searchRouter.route("/doctor/:username").get(async (req,res)=>{
    
})