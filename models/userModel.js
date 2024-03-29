const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide Name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please provide email'],
    lowercase: true,
    validate: [validator.isEmail, 'please  provide a valid email '],
  },
  photo: {
    type: String,
  },

  role: {
    type: String,
    required: [true, 'please provide role'],
  },
  password: {
    type: String,
    required: [true, 'please provide the password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please provide valid password'],
    validate: function (val) {
      console.log('yes');
      return this.password === val;
    },
  },

  changePasswordAt: {
    type: Date,
  },

  passwordResetToken: String,
  passwordResetExpire: String,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save',function(next){
  if(this.isModified('password')  || this.isNew) return next()
  this.changePasswordAt = Date.now()-1000
  next()
})
userSchema.methods.correctpassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};

userSchema.pre(/^find/,function(next){
    this.find({active:true})
    next()
})
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.changePasswordAt) {
    const changePasswordAtTimeStamp = this.changePasswordAt.getTime() / 1000;

    return  JWTTimestamp < changePasswordAtTimeStamp ;// total second  of iat is less than change pasword time that means older token is using by attackers
  }
 // False means  password not change
  return false;
};
userSchema.methods.createRandomStringForForgotPassword = function () {
  const randomToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(randomToken)
    .digest('hex');

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  console.log(this.passwordResetToken, randomToken);

  return randomToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
