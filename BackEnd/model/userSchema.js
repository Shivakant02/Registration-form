const mongoose=require('mongoose')
const { Schema } = mongoose;
const JWT = require('jsonwebtoken')
const bcrypt=require('bcrypt')


const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Name is Required"],
        minlenght: [5, "Name must be atleast 5 characters"],
        maxlength: [30, "Name must be less than 30 characters"],
        trim:true
    },
    email: {
        type: String,
        required: [true,"User email is required"],
        unique: [true,"Already registerd email"],
        lowercase:true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlenght: [8, "Password atleas 8 chars"],
        select:false
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpDate: {
        type:String
    }


}, {
    timestamps:true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
  //method for generating the jwt token
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.SECRET,
      { expiresIn: '24h' } // 24 hours
    );
  },

  //userSchema method for generating and return forgotPassword token
  getForgotPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    /// forgot password expiry date
    this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000; // 20min

    //step 2 - return values to user
    return forgotToken;
  },
};

module.exports = mongoose.model('user', userSchema);

