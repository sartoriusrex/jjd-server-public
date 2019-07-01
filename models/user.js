const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Technique = require("./technique");
const Sequence = require("./sequence");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: String,
    required: true,
  },
  techniques: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Technique",
  }],
  likedTechs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Technique",
  }],
  sequences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sequence"
  }],
  likedSeqs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sequence"
  }],
  sentMessages: [{
    type: String,
    timestamp: { type: Date, default: Date.now},
  }],
  accountVerificationToken:{
    type: String,
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordTokenExpires: {
    type: Date
  }
});


userSchema.pre("save", async function( next ){
  try{
    if( !this.isModified("password") ) {
      return next();
    }
    let hashedPassword = await bcrypt.hash( this.password, 10 );
    this.password = hashedPassword;
    return next();
  } catch( err ){
    return next( err );
  }
});

userSchema.pre("remove", async function( next ){
  try {
    // User's techs and seqs are not deleted, but reassigned to new username: deleted. This is done to preserve integrity of other techs or sequences that may references this user's tech or seqs.
    await Technique.update(
      { user: this._id },
      { user: "5d0dcaf1566d5ca22c8d3be0" }
    );

    await Sequence.update(
      { user: this._id },
      { user: "5d0dcaf1566d5ca22c8d3be0" }
    );

  } catch( err ) {
    return next( err );
  }
});

userSchema.methods.comparePassword = async function( candidatePassword, next ) {
  try {
    let isMatch = await bcrypt.compare( candidatePassword, this.password );
    return isMatch;
  } catch( err ) {
    return next( err );
  }
}

const User = mongoose.model("User", userSchema);

module.exports = User;