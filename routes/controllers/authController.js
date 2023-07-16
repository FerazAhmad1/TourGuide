 const crypto = require('crypto')
const { promisify } = require('util');
const sendMail = require('../../utilities/email');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });
  console.log(newUser,'gggggggggggggggggggggggggggggggggggggggggg')
    const token = signToken(newUser._id);
    newUser.password=undefined
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status:'Fail',
      message:error.message
    })
  }
};
exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    //   1) check email and password is exist

    if (!email||!password || !password.trim() ) {
      throw new Error('please provide email and password');
    }

    console.log('##Check--', !password)
    //Validate email

    // if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'invalid email',
    //   });
    // }
    //   2) check user  exist for corresponding email and paassword

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctpassword(password, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'unAuthorize',
      });
      return;
    }

    //  3) if everythink is ok then send json web token to the client

    const token = signToken(user._id);
    const cookieOption = {
      expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE_IN*24*60*60*1000),
      // this makes cookie only be send to encripted connection,basically using https
      httpOnly:true

    }

    if(process.env.NODE_ENV==='production')cookieOption.secure=true
      res.cookie('jwt',token,cookieOption)
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.protect = async function (req, res, next) {
  // 1)check if token is present in request or not
  try {
    let token;
    console.log('yes 67');
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      console.log('yyyyyyyyyyyyyyyyyyyyy 75');
      token = req.headers.authorization.split(' ')[1];
      console.log(req.headers.authorization.split(' ')[1]);
    }
    console.log(token, 5555555555555555);
    if (!token) {
      throw Error({
        message: 'you are not logged in please login to get access',
        status: 401,
      });
    }

    //  2)verificaion of token
    console.log('hello');
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded,'decoded');

    //  3)  check if user still exist or not

    const currentUser = await User.findById(decoded.id);
    console.log('currentUser',currentUser)
    if (!currentUser) {
      console.log('user does not exist')
      throw new Error('user does not exist');
    }
    console.log(currentUser.changePasswordAfter(decoded.iat),'checking afterpassword')

    // 4) check if user changed  pasword after token was issued

    if (currentUser.changePasswordAfter(decoded.iat))
    {
      console.log('this is old token')
      throw new Error('this is a old token')
    }
    req.user = currentUser;
    console.log("passing to next middleware")
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
    return;
  }
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    console.log('ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt')
    try {
      console.log(req.user, !roles.includes(req.user.role));
      if (!roles.includes(req.user.role)) {
        throw new Error('you are not authorize to perform this action');
      }
      next();
    } catch (error) {
      console.log(error.message,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      res.status(401).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
};
exports.forgotPassword = async function (req, res, next) {
  try {
    //  1)Get User based on posted email

    const user = await User.findOne({ email: req.body.email });

    if(!user){
       throw new Error('User does not Exist')
    }

    // Generate the random reset token

    const randomToken = user.createRandomStringForForgotPassword();

    await user.save({ validateBeforeSave: false });
    // send Mail to the user email

    const resetURL = `${req.protocol}//${req.get(
      'host'
    )}/api/v1/users/resetpassword/${randomToken}`;

    const message = `forgot your password?submit a patch request with your new password and password confirm to reset URL ${resetURL}.\n if you dont forgot your password just ignore this mail`;
    console.log('message', message);
    try {
      await sendMail({
        email: user.email,
        subject: 'your password reset mail',
        message,
      });
      res.status(200).json({
        status: 'success',
        message: 'token sent to the mail',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      user.save({ validateBeforeSave: false });
      res.status(500).json({
        status: 'fail',
        message: 'there was an error sending the mail please try again later',
      });
    }
    
    console.log('yes', user);
  } catch (error) {
    res.status(403).json({
      status: 'fail',
      message: error.message,
    });
  }
  next();
};
exports.resetPaswword =async (req,res,next)=>{
  console.log('inside rhe conrtroller');
try {
  // 1) First encrypt the token

const hashtoken = crypto
.createHash('sha256')
.update(req.params.token)
.digest('hex');
if(!hashtoken){
  throw new Error('Invalid user')
}

// 2). Find user on the basis of token if user is available set the new password

const user =  await User.findOne({passwordResetToken:hashtoken,passwordResetExpire:{$gt:Date.now()}})

if(!user){
  throw new Error('Invalid user')
}

user.password=req.body.password
user.passwordConfirm = req.body.passwordConfirm
user.passwordResetToken=undefined
user.passwordResetExpire= undefined
await user.save()

// 3) Update the changePasswordAt 

 // 4) give the login access 

 const token = signToken(user._id);
 res.status(200).json({
   status: 'success',
   token,
 });

} catch (error) {
  res.status(404).json({
    status:'fail',
    message:error.message
  })
}





}


exports.updatePassword = async (req,res,next)=>{

  try {
    // catch loggedin user
  const user = await User.findById(req.user.id).select('+password')
  if(!user||!await user.correctpassword(req.body.password,user.password)
  ){
    throw new Error ('Invalid user or  password')
  }
   
  
 // if both password is correct then update the password

 user.password = req.body.newpassword
 user.passwordConfirm = req.body.passwordConfirm
  user.save()
  const token = signToken(user._id)
  
  res.status(200).json({
    staus:"success",
    token
  })

  } catch (error) {
    res.status(401).json({
      status:'Fail',
      message:error.message
    })
  }
}