const express = require("express");
const router = express.Router({ mergeParams: true });

const { createSequence, editSequence, deleteSequence, findSequences } = require("../handlers/sequences");

// prefix = /api/users/:id/sequences
router.route("/").post( createSequence );

router.route("/").get( findSequences );

router
  .route("/:sequenceid")
  .patch( editSequence )
  .delete( deleteSequence );

module.exports = router;