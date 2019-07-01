const db = require("../models");

exports.createSequence = async function( req, res, next ) {
  try {

    let sequence = await db.Sequence.create({
      name: req.body.name,
      user: req.params.id,
      description: req.body.description,
      notes: req.body.notes,
      techniques: req.body.techniques,
      thumbnail: req.body.thumbnail,
    });

    let foundUser = await db.User.findById( req.params.id );
    foundUser.sequences.push( sequence.id );

    await foundUser.save();

    let foundSequence = await db.Sequence.findById( sequence._id )
    .populate( "user", {
      username: true,
    })
    .populate( "techniques", {
      name: true,
      _id: true,
      thumbnail: true,
      type: true,
      positionMajor: true,
      positionMinor: true,
      mode: true,
      description: true,
      notes: true,
      steps: true
    })

    return res.status( 200 ).json( foundSequence );
    
  } catch( err ) {
    return next( err );
  }
};

exports.editSequence = async function( req, res, next ) {
  try {
    let edittedSequence = await db.Sequence
      .findByIdAndUpdate( 
        req.params.sequenceid,
        req.body, 
        { new: true } 
      );

    return res.status( 200 ).json( edittedSequence );
  } catch( err ) {
    return next( err );
  }
}

exports.deleteSequence = async function( req, res, next ) {
  try {
    let foundSequence = await db.Sequence
      .findById( req.params.sequenceid );
    
    await foundSequence.remove();
    return res.status( 200 ).json( foundSequence );

  } catch( err ) {
    return next( err );
  }
};

exports.findSequences = async function( req, res, next ){
  try {
    let array = req.query.array;

    let foundSequences = await db.Sequence
      .find({
        $or: [{ _id: array }]
      })
      .sort( { name: 1 } )
      .populate( "user", {
        username: true
      })
      .populate( "techniques", {
        name: true,
        _id: true,
        thumbnail: true,
        type: true,
        positionMajor: true,
        positionMinor: true,
        mode: true,
        description: true,
        notes: true,
        steps: true
      })

    return res.status( 200 ).json( foundSequences );
  } catch( err ) {
    return next( err );
  }
}