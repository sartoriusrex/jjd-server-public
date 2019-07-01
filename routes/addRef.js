const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require('../models');

//Technique add Ref : "/api/users/:id/techniqueRefs" is the prefix

router.get("/", async function( req, res, next) {
  
  // if there is an array of techIds to look up, then we search, otherwise return nothing

  console.log(req.query);

  try{
    let refs = req.query.refs;

    let techniqueRefs = await db.Technique.find({
      _id: { $in: refs }
    })
    .sort( { name: 1 } );

    return res.status( 200 ).json( techniqueRefs );
  } catch( err ) {
    next( err )
  }
});


module.exports = router;