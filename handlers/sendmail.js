const db = require("../models");
const mailgun = require("mailgun-js");
const crypto = require('crypto');

const DOMAIN = process.env.DOMAIN || "sandbox42042dfa94a14f72a6e0008fbc955c8c.mailgun.org";
const MG_API_KEY = process.env.MG_API_KEY || 
"b431024f16aabb5cefeff2d4b83e9cf5-2b0eef4c-f5a43468";

const mg = mailgun({ apiKey: MG_API_KEY, domain: DOMAIN });


exports.sendAccountVerificationEmail = async function( accountVerificationToken, email, res, next ) {
  let subject = "Verify your account with Jiu Jitsu Distilled";

  let verifyLink = `https://jjd-client-v1.herokuapp.com/verifyaccount/${ accountVerificationToken }`

  let output = `
      <h3>Verify your new account with JJD: ${ email }</h3>
      <p>You are receiving this message because you or someone else has created an account with Jiu Jitsu Distilled (JJD).</p>
      <p>If you did not want to create an account, ignore this e-mail. No one will be able to use your account in your name. If you choose to create an account later, please visit our website.</p>
      <p>To complete Sign Up Process, please click the following link or paste it into your browser. </p>
      <p><a href=${ verifyLink }>Verify Account</a></p>
      <p>Full Link: ${ verifyLink } </p>
    `;

  let data = {
    from: 'JJD Admin <admin.jjd@jjd.com>',
    to: email,
    subject: subject,
    html: output
  };

  mg.messages().send( data, function ( error, body ) {
    if ( error ) {
      console.log(error);
      console.log(body);

      if( body.message === "'to' parameter is not a valid address. please check documentation" ) {
        let error = {}
        error.message = "That is not a valid e-mail address"

        return next( error );
      }

      next( body );
    } else {
      console.log("===========================");
      console.log( body );
      console.log("===========================");
  
      res.status( 200 ).json({
        message: "Account Verification E-mail Has Been Sent. Please check your e-mail for further instructions."
      });
    }
  });
}

exports.sendFeedback = async function( req, res, next ){
  let id = req.params.id;
  let from = req.body.from;
  let to = req.body.to;
  let username = req.body.username;
  let subject = req.body.subject;
  let body = req.body.body;

  let foundUser = await db.User.findById( id );
  foundUser.sentMessages.push( body );

  foundUser.save();

  let output = `
    <h2>New Message from ${ username }</h2>
    <div>
      <p>User ID: ${ id }</p>
      <p>e-mail: ${ from }</p>
    </div>
    <h4>Message</h4>
    <p>${ body }</p>
  `;

  let data = {
    from: 'JJD Admin <admin.jjd@jjd.com>',
    to: to,
    subject: subject,
    html: output
  };

  mg.messages().send( data, function ( error, body ) {
    if ( error ) {
      console.log( error );
      next( error );
    }

    console.log("===========================");
    console.log( body );
    console.log("===========================");

    res.status( 200 ).json({
      message: "Your Message Was Sent!"
    });
  });
}

exports.sendResetPasswordEmail = async function( req, res, next ){
  try{
    let token = crypto.randomBytes(20).toString('hex');
    let email = req.body.email;
    let subject = "Request to Reset Password for Jiu Jitsu Distilled";
    const resetLink = `https://jjd-client-v1.herokuapp.com/resetpassword/${ token }`
    
    let foundUser = await db.User.findOneAndUpdate(
      { email: email },
      { 
        resetPasswordToken: token,
        resetPasswordTokenExpires: ( Date.now() + 172800000 ) //48 hours
      }
    );

    if ( foundUser === null ){
      let message = {}
      message.message = "It seems like that e-mail isn't in our database."

      return next( message )
    }

    let output = `
      <h3>Reset Password for ${ email }</h3>
      <p>You are receiving this message because you or someone else has requested a password reset for your account for Jiu Jitsu Distilled (JJD).</p>
      <p>If you did not request a password reset, ignore this e-mail and your account will remain unchanged.</p>
      <p>To complete the Password Reset Process, please click the following link or paste it into your browser within 48 hours of receiving this e-mail.
      <p><a href=${ resetLink }>Reset Password Now</a></p>
      <p>Full Link: ${ resetLink } </p>
    `;

    let data = {
      from: 'JJD Admin <admin.jjd@jjd.com>',
      to: email,
      subject: subject,
      html: output
    };

    mg.messages().send( data, function ( error, body ) {
      if ( error ) {
        console.log(error);
        console.log(body);

        if( body.message === "'to' parameter is not a valid address. please check documentation" ) {
          let error = {}
          error.message = "That is not a valid e-mail address"

          return next( error );
        }

        next( body );

      } else {

        console.log("===========================");
        console.log( body );
        console.log("===========================");

        res.status( 200 ).json({
          message: "Reset instructions sent to e-mail provided. Please check your e-mail and follow the instructions within 48 hours."
        });
      }
    });

  } catch( err ) {
    console.log("======catch block=======");
    console.log( err );
    console.log("======catch block=======");
    next( err );
  }
}