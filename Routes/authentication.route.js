const  regRouter = require('express').Router();
const crypto = require("crypto");

require('dotenv').config()

const Patient = require('../Models/patient')
const Hospital = require('../Models/hospital')
const Doctor = require('../Models/doctor')
const PathLab = require('../Models/pathlab')
const Token = require('../Models/token')



const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
  } = require('../Helper/jwt_method')

const {
    createSendToken

} = require('../Utils/middleware')


// Helpers
const isValidToken = async (username,token) =>
{
    await Patient.findOne({username})
    .then( async (prof) =>
    {
        console.log("invalidation method ",prof.loginToken," sdfd" , token," result ", token == prof.loginToken)
        if(prof.loginToken == "")
        {
            console.log("undefined token")
            return false;
        }
        
        return await token == prof.loginToken;
        
            
    }
    )
}

const filterOut = (info) => {
    let fieldsReq = ["fullName","username","password","emailId","contactNo","dob","state","city","gender","demographicInfo"];
    let outInfo = {};
    fieldsReq.forEach(fld => {
        if(info.hasOwnProperty(fld))
        {

            outInfo[fld] = info[fld];

        }
        
    });

    return outInfo;
    
} 

regRouter.route('/register').post(async (req,res) => {

    let userType = req.body.userType
    if(userType == 'user')
    {
        let det = filterOut(req.body);
        
        
        let newUser = new Patient({...det})

        await Patient.findOne({emailId:det.emailId})
        .then(async (profile) => {
            if(!profile)
            {
                await newUser.save()
                .then(async (user)=>{
                        // const accessToken = await signAccessToken([user.id,user.username])
                        // console.log(accessToken)
                        // const refreshToken = await signRefreshToken([user.id,user.username])
                        
                        // console.log(refreshToken)
                        // res.status(200).json({
                        //     success: 1,
                        //     accessToken: accessToken,
                        //     refreshToken: refreshToken,
                        //     message: 'You are successfully registerd',
                        
                        // });
                        // res.status(200).json({
                        //     success:1,
                        //     message:"You are successfully registerd"
                        // })
                        req.user = {emailId:user.emailId,_id:user._id}
                        createSendToken(req,res)
                })
                .catch(
                    err => {
                        console.log("Error is ", err.message);
                        res.status(200).json({
                                        success: 0,
                                        message: 'registeration failed',
                                        error: err
                            
                                            });
            
                            }
                )
            }
            else{
                res.status(200).json({
                    success: 0,
                    message:"User already exists....."
                })
            }
        })
        
    }
    else if(userType == 'doctor')
    {
        let det = req.body
        delete det.userType
        let newUser = new Doctor({...det,isLoggedin:true})

        await Doctor.findOne({emailId:det.emailId})
        .then(async (profile) => {
            if(!profile)
            {
                await newUser.save()
                .then(async (user)=>{
                        // const accessToken = await signAccessToken([user.id,user.username])
                        // console.log(accessToken)
                        // const refreshToken = await signRefreshToken([user.id,user.username])
                        
                        // console.log(refreshToken)
                        // res.status(200).json({
                        //     success: 1,
                        //     accessToken: accessToken,
                        //     refreshToken: refreshToken,
                        //     message: 'You are successfully registerd',
                        
                        // });
                        res.status(200).json({
                            success:1,
                            message:"Your request is successfully registered, wait for verfication."
                        })
                })
                .catch(
                    err => {
                        console.log("Error is ", err.message);
                        res.status(200).json({
                                        success: 0,
                                        message: 'registeration failed',
                                        error: err
                            
                                            });
            
                            }
                )
            }
            else{
                res.status(200).json({
                    success: 0,
                    message:"Doctor already exists....."
                })
            }
        })
    }
    else if(userType == 'hospital')
    {
        let det = req.body
        delete det.userType
        let newUser = new Hospital({...det,isLoggedin:true})

        await Hospital.findOne({emailId:det.emailId})
        .then(async (profile) => {
            if(!profile)
            {
                await newUser.save()
                .then(async (user)=>{
                       
                        res.status(200).json({
                            success:1,
                            message:"Your request is successfully registered, wait for verfication."
                        })
                })
                .catch(
                    err => {
                        console.log("Error is ", err.message);
                        res.status(200).json({
                                        success: 0,
                                        message: 'registeration failed',
                                        error: err
                            
                                            });
            
                            }
                )
            }
            else{
                res.status(200).json({
                    success: 0,
                    message:"Hospital already exists....."
                })
            }
        })
    }
    else if(userType == 'pathlogy')
    {
        let det = req.body
        delete det.userType
        let newUser = new PathLab({...det,isLoggedin:true})

        await PathLab.findOne({emailId:det.emailId})
        .then(async (profile) => {
            if(!profile)
            {
                await newUser.save()
                .then(async (user)=>{
                        
                        res.status(200).json({
                            success:1,
                            message:"Your request is successfully registered, wait for verfication."
                        })
                })
                .catch(
                    err => {
                        console.log("Error is ", err.message);
                        res.status(200).json({
                                        success: 0,
                                        message: 'registeration failed',
                                        error: err
                            
                                            });
            
                            }
                )
            }
            else{
                res.status(200).json({
                    success: 0,
                    message:"Doctor already exists....."
                })
            }
        })
    }
    else{
        res.status(200).json({success:0,message:"User type invalid"})
    }
})






regRouter.route('/login').post(async (req,res) =>{
    let username = req.body.username
    let pass = req.body.password

    await Patient.findOne({username})
    .then(async (profile)=> {
        // let token =crypto.randomBytes(20).toString('hex');
        if(profile){
            if(await profile.isValidPassword(pass))
            {
                // await Patient.updateOne({username},{$set:{isLoggedin:true,loginToken:token}})
                // .then(async (resp)=>{
                //     await Patient.findOne({username},{password:0})
                //     .then((prof)=>{
                //         res.status(200).json({
                //             success:1,
                //             message:"You successfully logged in.",
                //             prof
                //         })
                //     })
                //     .catch(err =>{
                //         console.log(err)
                //         res.status(501).json({
                //         success:0,
                //         message:err
                //     })
                //     })
                    
                    
                // })
                // .catch(err => {
                //     console.log(err)
                //     res.status(501).json({
                //         success:0,
                //         message:err
                //     })
                // })
                let accessToken = await signAccessToken(profile._id.toString());
                res.status(200).json({
                    success:1,
                    message:"Login successful",
                    accessToken
                })
            }
            else
            {
                res.status(401).json({
                    success:0,
                    message:"Incorrect Password!!"
                }
                )
            }
            
        }
        else
        {
            res.status(404).json({
                success:0,
                message:"Profile doesn't exist."
            }
            )
        }
    })
    .catch(err => {
        console.log(err)
        res.status(501).json({
            success:0,
            message:err
        })
    })


})

regRouter.route('/confirmation/:token').get(async (req,res)=>{

    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
 
        // If we found a token, find a matching user
        Patient.findOne({ _id: token._userId }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ success:0, msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).json({success:1 , message:"The account has been verified. Please log in"});
            });
        });
    });

})

regRouter.route('/logout').post(async (req,res)=>{

    console.log(req.headers)
    const isValid = await isValidToken(req.headers['username'],req.headers['token'])
    
    if(isValid)
    {
        
        let username = req.headers['username'];
        await Patient.updateOne({username},{$set:{isLoggedin:false,loginToken:""}})
        .then((resp)=>{
            console.log(`${username} log out`)
            res.status(200).json({
                success:1,
                message:"Logged out"
            })
        })
        .catch((err)=>{
            res.status(500).json({
                success:0,
                message:err
            })
        })
    }
    else
    {
        res.status(401).json({
            success:0,
            message:"unauthorized"
        })
    }

    
})



module.exports = regRouter;