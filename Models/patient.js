const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const patientSchema = new Schema(
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
        },
        dob:{
            type:Date,
            required:true
        },
        
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true,
            enum:['Male','Female','Prefer not to say']
        },
        demographicInfo:{
            weight:{
                type:mongoose.Decimal128
            },
            height:{
                type:mongoose.Decimal128
            },
            bmi:{
                type:mongoose.Decimal128
            },
            bloodGroup:{
                type:String,
                enum:['A+','B+','AB+','O+','A-','B-','AB-','O-']
            }

        },
        docAppointment:[
            {
                appId:{
                    type:String
                },
                doctor:{
                    type: mongoose.ObjectId,
                    ref: 'Doctor'
                },
                date:{
                    type:Date
                }

            }
        ],
        labAppointment:[
            {
                testId:{
                    type:String
                },
                lab:{
                    type:  mongoose.ObjectId,
                    ref: 'PathLab'
                },
                date:{
                    type:Date
                }

            }
        ],
        medicalReports:[
            {
                type:  mongoose.ObjectId,
                ref: 'MedicalReports'
            }
        ],
        sentRequests:[{
            docId : {
                type:mongoose.ObjectId,
                ref:'Doctor'
            },
            status:{
                type:String,
                enum:["Accepted","Sent","Rejected"],
                default:"Sent"
            }
            
        }],
        isLoggedin:{
            type:Boolean,
            default:false
        },
        isVerified:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
)

patientSchema.pre('save', async function (next) {
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

patientSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    }catch (error) {
      throw error
    }
  }


const patient = mongoose.model('Patient',patientSchema);

module.exports = patient;