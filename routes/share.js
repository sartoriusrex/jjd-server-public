const express = require("express");
const router = express.Router({ mergeParams: true });

const { shareItem } = require("../handlers/sendmail");

router.route("/").post( shareItem );

module.exports = router;