const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require('../models')

//Technique Index - available to all - 

router.get("/", async function( req, res, next) {
  
  // If there is a search from the api/techniques page, then search, otherwise return all techniques up to stated limit

  if( req.query.search && req.query.search.length > 0 ) {
    try {
      console.log( req.query );
      console.log("=============")
      const regex = new RegExp( escapeRegex( req.query.search ), 'gi');
    
      let foundTechniques = await db.Technique.find(
      { $or: [{ name: regex }, { type: regex }, { positionMajor: regex }, { positionMinor: regex }, { description: regex } ] },
      { score: { $meta: "textScore" } }
      )
      .sort( { score: { $meta: "textScore" } } )
      .limit( 20 )
      .populate( "user", {
        username: true,
      });

      console.log(foundTechniques);
      console.log("=--------------=")

      return res.status( 200 ).json( foundTechniques );
    } catch( err ) {
      console.log('=========================');
      console.log(err )
      next( err );
    }

  } else {

    try {
      let techniques = await db.Technique.find()
        .sort( { name: 1 } )
        .limit( 40 )
        .populate( "user", {
          username: true,
        });

      return res.status( 200 ).json( techniques );
    } catch( err ) {
      console.log( err );
      next( err );
    }
  }
});

//Technique Show - available to all

router.get("/:techid", async function( req, res, next) {
  try {
    let technique = await db.Technique.findById( req.params.techid );

    return res.status( 200 ).json( technique );
  } catch( err ) {
    return next( err );
  }
});

const escapeRegex = text => 
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

module.exports = router;