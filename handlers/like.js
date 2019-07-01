const db = require("../models");

exports.updateLikes = async function( req, res, next ) {

  try {
    let id = req.params.id;
    let to = req.body.to;
    let foundUser;
    let likedTechs;
    let likedSeqs;

    if( to === "techs" ) {
      likedTechs = req.body.newLikes;

      foundUser = await db.User.findByIdAndUpdate(
        id, { likedTechs: likedTechs }, { new: true }
      );
    } else {
      likedSeqs = req.body.newLikes;

      foundUser = await db.User.findByIdAndUpdate(
        id, { likedSeqs: likedSeqs }, { new: true }
      );
    }

    return res.status( 200 ).json( foundUser )
  } catch( err ) {
    return next( err );
  }
}