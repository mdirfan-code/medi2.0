const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema();

const supMemSchema = new Schema(
    {
        username:{
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
        fullName:{

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
        }
    },
    {
        timestamps:true
    }
)

supMemSchema.pre('save', async function (next) {
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

supMemSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    }catch (error) {
      throw error
    }
  }

const supMem = mongoose.model('SupportMember',supMemSchema);

module.exports = supMem;