const db = require("../models");

exports.createTechnique = async function( req, res, next ) {
  try {
    let technique = await db.Technique.create({
      name: req.body.name,
      user: req.params.id,
      type: req.body.type,
      positionMajor: req.body.positionMajor,
      positionMinor: req.body.positionMinor,
      mode: req.body.mode,
      description: req.body.description,
      notes: req.body.notes,
      steps: req.body.steps,
      video: req.body.video,
      thumbnail: req.body.thumbnail,
      entries: req.body.entries,
      reactions: req.body.reactions,
      resources: req.body.resources,
    });

    let foundUser = await db.User.findById( req.params.id );
    foundUser.techniques.push( technique.id );

    await foundUser.save();

    let foundTechnique = await db.Technique
      .findById( technique._id )
      .populate(
        "user", 
        { username: true }
      );

    return res.status( 200 ).json( foundTechnique );
    
  } catch( err ) {
    return next( err );
  }
};

exports.editTechnique = async function( req, res, next ) {
  try {
    let edittedTechnique = await db.Technique
      .findByIdAndUpdate(
        req.params.techid,
        req.body, 
        { new: true }
      );

    return res.status( 200 ).json( edittedTechnique );
  } catch( err ) {
    return next( err );
  }
}

exports.deleteTechnique = async function( req, res, next ) {
  try {
    let foundTechnique = await db.Technique
      .findById( req.params.techid );
    
    await foundTechnique.remove();

    await db.Technique.update(
      {},
      { $pull : { 
        entries: { _id: req.params.techid }, 
        reactions: { _id: req.params.techid } 
      }},
      { multi: true }
    );

    await db.Sequence.update(
      {},
      { $pull : { techniques: { _id: req.params.techid } } },
      { multi: true }
    );

    return res.status( 200 ).json( foundTechnique );
  } catch( err ) {
    return next( err );
  }
};

exports.findTechniques = async function( req, res, next ){
  try {
    let array = req.query.array;

    let foundTechniques = await db.Technique
      .find({ $or: [ { _id: array } ] })
      .sort( { name: 1 } )
      .populate(
        "user",
        { username: true }
      );

    return res.status( 200 ).json( foundTechniques );
  } catch( err ) {
    return next( err );
  }
}