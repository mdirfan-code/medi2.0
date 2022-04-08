const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema();

const medicalReportSchema = new Schema(
    {
      userId:{
          type: Schema.Types.ObjectId,
          ref:''
      },
      testDate:{
          type:Date,
          required:true
      },
      bloodPressure:{
          systolic:{
            type: mongoose.Decimal128,
            
          },
          diastolic:{
            type: mongoose.Decimal128
          }
      },
      bloodSugar:{
          preMeal:{
            type: mongoose.Decimal128
          },
          postMeal:{
            type: mongoose.Decimal128
          }
      },
      cholestrol:{
          totalCholestrol:{
            type: mongoose.Decimal128
          },
          triglycerides:{
            type: mongoose.Decimal128
          },
          hdl:{
            type: mongoose.Decimal128
          },
          ldl:{
            type: mongoose.Decimal128
          }
      },
      diagnosedDisease:{
        prediabetes:{
            type:Boolean,
            default:false
        },
        diabetes:{
            type:Boolean,
            default:false
        },
        hypertension:{
            type:Boolean,
            default:false
        },
        obesity:{
            type:Boolean,
            default:false
        },
        highCholesterol:{
            type:Boolean,
            default:false
        },
        chronicKidneyDisease:{
            type:Boolean,
            default:false
        },
        cancer:{
            type:String,
            default:'',
            enum:['','breast','lung','colorectal','renal cell','other']
        },
        anemia:{
            type:Boolean,
            default:false
        }
      }

    },
    {
        timestamps:true
    }
)



const medReport = mongoose.model('MedicalReports',medicalReportSchema);

module.exports = medReport;