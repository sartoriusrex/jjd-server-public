const express = require("express");
const router = express.Router({ mergeParams: true });
const { sendFeedback, sendResetPasswordEmail } = require("../handlers/sendmail");

router.route("/message").post( sendFeedback );
router.route("/").post( sendResetPasswordEmail );

module.exports = router;