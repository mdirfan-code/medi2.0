const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const Patient = require('../Models/patient')

require('dotenv').config()


module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {userId}
      const secret = process.env.ACCESS_KEY
      const options = {
        expiresIn: '24h',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        console.log(token)
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    console.log(req.headers['authorization'])
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_KEY, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        console.log(message,"ieiiei")
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      
      next()
    })
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {userId}
      const secret = process.env.REFRESH_KEY
      const options = {
        expiresIn: '1y',
        issuer: 'pickurpage.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, async (err, token) => {
        if (err) {
          console.log(err.message)
          // reject(err)
          reject(createError.InternalServerError())
        }

      await Patient.findOneAndUpdate(
           {_id:userId},
           {
               "$set":{"refreshToken":token}
           }
           )
           .then(
               (resp) => {
                   console.log(resp)
               }
           )
           .catch(
               (err) => {
                console.log(err.message)
                // reject(err)
                reject(createError.InternalServerError())
               }
           )
    })
  })},
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_KEY,
        async (err, payload) => {
          if (err) return reject(createError.Unauthorized())
          const userId = payload.aud
         await Patient.findOne({_id:userId})
         .then((result)=>{
            if (refreshToken === result) return resolve(userId)
            reject(createError.Unauthorized())
         })
         .catch((err)=>{
            console.log(err.message)
            reject(createError.InternalServerError())
            return

         })
        //   client.GET(userId[0], (err, result) => {
        //     if (err) {
        //       console.log(err.message)
        //       reject(createError.InternalServerError())
        //       return
        //     }
        //     if (refreshToken === result) return resolve(userId)
        //     reject(createError.Unauthorized())
        //   })
        }
      )
    })
  },
}