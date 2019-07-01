const express = require("express");
const router = express.Router({ mergeParams: true });

const { createTechnique, editTechnique, deleteTechnique, findTechniques } = require("../handlers/techniques");

// prefix = /api/users/:id/techniques
router.route( "/" ).post( createTechnique );

router.route( "/" ).get( findTechniques );

router
  .route( "/:techid" )
  .patch( editTechnique )
  .delete( deleteTechnique );

module.exports = router;