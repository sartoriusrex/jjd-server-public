const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { sendAccountVerificationEmail } = require("./sendmail");

exports.signin = async function( req, res, next ){
  try {
    // Once update to sign-up to verify account is finished; find user by either email or username AND is verified;
    let user = await db.User.findOne({
      $and : [
        { $or : [ 
          { email: req.body.user },
          { username: req.body.user } 
        ] },
        { isVerified: true }
      ]
    });

    let { id, username, email, techniques, likedTechs, sequences, likedSeqs } = user;
    let isMatch = await user.comparePassword( req.body.password );

    if( isMatch ) {
      let token = jwt.sign({
        id,
        username,
      }, process.env.SECRET_KEY
      );
      let message = "Welcome Back.";

      return res.status( 200 ).json({
        id, username, email, techniques, likedTechs, sequences,likedSeqs, token, message
      });
    } else {
      return next({
        status: 400,
        message: "The email or password is Invalid."
      });
    }
  } catch( err ) {
    return next({
      status: 400,
      message: "No Account Found with that E-mail Address or Username."
    });
  }
  
};

exports.signup = async function( req, res, next ) {
  try {
    let verificationToken = crypto.randomBytes(20).toString('hex');
    let duplicateCheck = await checkDuplicate( req );

    if( duplicateCheck.error ) {
      return next({
        status: 400,
        message: duplicateCheck.error,
      })
    }

    sendAccountVerificationEmail( verificationToken, req.body.email, res, next );

    await db.User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      accountVerificationToken: verificationToken,
      isVerified: false
    });

  } catch( err ) {
    if( err.code === 11000 ) {
      err.message = "Sorry, that username and/ or e-mail is taken.";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.verifyAccount = async function( req, res, next ){
  try {
    let accountVerificationToken = req.params.accountVerificationToken;
    let foundUser = await db.User.findOneAndUpdate(
      { accountVerificationToken: accountVerificationToken },
      { 
        isVerified: true,
        accountVerificationToken: ""
      }
    )

    let { id, username, email, techniques, likedTechs, sequences, likedSeqs } = foundUser;
    let token = jwt.sign(
      { id, username },
      process.env.SECRET_KEY
    );

    res.status( 200 ).json({
      id, username, techniques, likedTechs, sequences, likedSeqs, email, token,
      message: "Account Verified. Welcome to Jiu Jitsu Distilled."
    })

  } catch ( err ){
    let error = {};
    error.message = "The Account Verification Token Could Not Be Found.";

    return next( error );
  }
}

exports.verifyToken = async function( req, res, next ) {
  try {
    let token = req.params.token;
    let foundUser = await db.User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if ( foundUser === null ) {
      let error = {}
      error.message = "The password token has either changed, is incorrect, or has surpassed the 48-hour expiration limit";

      return next( error );
    }

    res.status( 200 ).json({
      message: "Token Verified. Please reset your password."
    })

  } catch ( err ){
    next( err );
  }
}

exports.resetPassword = async function( req, res, next ){
  try{
    let { email } = req.body;
    let passwordToken = req.body.token;
    let newPassword = req.body.password;
    let hashedPassword = await bcrypt.hash( newPassword, 10 );

    let foundUser = await db.User.findOneAndUpdate(
      { email: email, resetPasswordToken: passwordToken },
      { 
        password: hashedPassword,
        resetPasswordToken: "",
        resetPasswordTokenExpires: "",
      }
    )

    if ( foundUser === null ) {
      let error = {}
      error.message = "The e-mail address and password token do not match. Did you use the same e-mail address that we sent the link to this page to?";

      return next( error );
    }

    await foundUser.save();

    let { id, username, techniques, likedTechs, sequences, likedSeqs } = foundUser;

    let token = jwt.sign({
      id,
      username,
    }, process.env.SECRET_KEY );

    let message = "Password Successfully Reset. Welcome Back."

    return res.status( 200 ).json({
      id, username, email, techniques, likedTechs, sequences, likedSeqs, token, message
    });

  } catch( err ){
    next( err );
  }
}

exports.updateUser = async function( req, res, next ){
  try{
    let userid = req.params.userid;
    let update;

    if ( req.body.password ) {
      let newPassword = req.body.password;
      let hashedPassword = await bcrypt.hash( newPassword, 10 );

      update = { password: hashedPassword }
    } else {
      update = req.body
    }

    let duplicateCheck = await checkDuplicate( req );

    if( duplicateCheck.error ) {
      return next({
        status: 400,
        message: duplicateCheck.error,
      })
    }

    let foundUser = await db.User.findByIdAndUpdate(
      userid, update, { new: true }
    )

    if ( foundUser === null ) {
      let error = {}
      error.message = "You are attempting to update a user that does not exist";

      return next( error );
    }

    let { id, username, email, techniques, likedTechs, sequences, likedSeqs } = foundUser;

    let token = jwt.sign({
      id,
      username,
    }, process.env.SECRET_KEY );

    let message;
    
    if( req.body.password) {
      message = "Password Updated."
    } else if ( req.body.username ) {
      message = "Username Updated."
    } else {
      message = "E-mail Updated."
    }

    return res.status( 200 ).json({
      id, username, email, techniques, likedTechs, sequences, likedSeqs, token, message
    });

  } catch( err ) {
    next( err );
  }
}

exports.deleteUser = async function( req, res, next ){
  try {
    let userid = req.params.userid;
    let foundUser = await db.User.findById( userid );

    await foundUser.remove();

    return res.status( 200 ).json( foundUser );

  } catch( err ) {
    console.log( err );

    next( err );
  }
}

async function checkDuplicate( req ){
  let response = {}

  try {
    let duplicateUser = await db.User.findOne({
      $or: [ 
        { username: req.body.username },
        { email: req.body.email }
      ]
    });

    if( duplicateUser !== null ) {
      response.error = "Sorry, that username or email address is already taken.";

      return response;
    } 

    response.success = true;

    return response;

  } catch( err ) {
    response.success = true;

    return response;
  }
}