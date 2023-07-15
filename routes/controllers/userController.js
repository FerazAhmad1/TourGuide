const { findByIdAndUpdate } = require('../../models/userModel');
const User = require('../../models/userModel');





const filterObj =(obj,...allowedfilled)=>{
  const newObj = {}
  Object.keys(obj).forEach((property)=>{
    if(allowedfilled.includes(property)){
      newObj[property]=obj[property]
    }
  })
  console.log(newObj)
  return newObj
}







exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    res.json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet defined' });
};
exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet defined' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet defined' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'this route is not yet defined' });
};
exports.updateMe = async (req,res,next)=>{
   try {

    // 1).Creating error if user send password or confirm password
    if(req.body.password||req.body.passwordConfirm){
      throw new Error('this api is not for update password')
    }
    
// 2).if user is not sending "password" or "confirmPassword" then update document
   
   // Filtering the body because we cant not trust blindly on user he might update his role as admin
      //  const fiterBody = filterObj(req.body,'name','email')

   const usergetUpdated = await User.findByIdAndUpdate(req.user.id,{ name: 'aswin', email: 'aswin@gmail.com' },{
    new:true,
    runValidators:true
   })
    
   return res.status(200).json({
  status:'success',
  data :{
    user:usergetUpdated,
  }
})



   } catch (error) {
    res.status(400).json({
      staus:'Fail',
      message:error.message
    })
   }
}
exports.deleteMe = async(req,res,next)=>{
 const user = await User.findByIdAndUpdate(req.user.id,{active:false},{new:true})
  console.log(user)

 res.status(204).json({
  staus:"success",
  data:null
 })
   

}

