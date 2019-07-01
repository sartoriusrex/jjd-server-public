const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require('../models')

//Sequence Index - available to all - 

router.get("/", async function( req, res, next) {
  
  // If there is a search from the api/sequences page, then search, otherwise return all techniques up to stated limit

  if( req.query.search && req.query.search.length > 0 ) {

    try {
      const regex = new RegExp( escapeRegex( req.query.search ), 'gi');
    
      let foundSequences = await db.Sequence.find(
      { $or: [{ name: regex }, { description: regex } ] },
      { score: { $meta: "textScore" } }
      )
      .sort( { score: { $meta: "textScore" } } )
      .limit( 20 )
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
      });

      return res.status( 200 ).json( foundSequences );
    } catch( err ) {
      next( err );
    }

  } else {

    try {
      let sequences = await db.Sequence.find()
        .sort( { name: 1 } )
        .limit( 40 )
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
        });

      return res.status( 200 ).json( sequences );
    } catch( err ) {
      next( err );
    }
  }
});

//Sequence Show - available to all

router.get("/:sequenceid", async function( req, res, next) {
  try {
    let sequence = await db.Sequence.findById( req.params.sequenceid )
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
    });

    return res.status( 200 ).json( sequence );
  } catch( err ) {
    return next( err );
  }
});

const escapeRegex = text => 
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

module.exports = router;