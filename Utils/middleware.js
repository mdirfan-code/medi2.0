const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const Token = require('../Models/token')
// This method going to create a verification token for user and send it to his email Id.
const createSendToken = async (req,res) => {
    let user = req.user; 
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex')});    
                    
                    token.save(function (err) {
                        if (err) { return res.status(500).json({ 
                            success: 0,
                            message: err.message 
                        }); }
             
                        // Send the email
                        var transporter = nodemailer.createTransport({service:'hotmail', auth: { user: process.env.EMAIL_ID, pass: process.env.PASS_EMAIL },
                           
                           });
                        var mailOptions = { from: 'meditechsol@outlook.com', to: user.emailId, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/auth\/confirmation\/' + token.token + ' \n ThankYou' };
                        console.log(mailOptions)
                        transporter.sendMail(mailOptions, function (err) {
                            if (err) { return res.status(500).json({ msg: err}); }

                            
                            res.status(200).json({success:1,message:'A verification email has been sent to ' + user.emailId + '.'});
                        });
                    });
}

module.exports = {createSendToken};