const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const pathLabSchema = new Schema(
    {
        labUserId:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 5
        },
        password:{
              type: String,
              required: true,
              minlength: 8
          },
        registrationName:{

            type: String,
            required: true,
            minlength: 5
        },
        emailId:{
            type:String,
            required: true,
            unique:true,
            trim:true,
            minlength:7
        },
        contactNo:{
            type:String, 
            minlength:10,
            trim:true,
        },
        testList:{
            testtype:{
                type:String
            },
            testDiscription:{
                type:String
            },
            patient:{
                type:mongoose.ObjectId,
                ref:'Patient'
            },
            date:{
                type:Date
            },
            result:{
                type: mongoose.ObjectId,
                ref:'MedicalReports'
            }
        }
    },
    {
        timestamps:true
    }
)

pathLabSchema.pre('save', async function (next) {
    try {
      /* 
      Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
      */
      if (this.isNew) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
      }
      next()
    } catch (error) {
      next(error)
    }
  })

pathLabSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    }catch (error) {
      throw error
    }
  }

const pathLab = mongoose.model('PathLab',pathLabSchema);

module.exports = pathLab;