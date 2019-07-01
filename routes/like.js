const express = require("express");
const router = express.Router({ mergeParams: true });

const { updateLikes } = require("../handlers/like");

router.route("/").patch( updateLikes );

module.exports = router;