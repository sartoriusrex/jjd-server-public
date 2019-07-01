const express = require("express");
const router = express.Router();

const { updateUser, deleteUser } = require("../handlers/auth");

router.patch( "/updateuser/:userid", updateUser )
router.delete( "/updateuser/:userid", deleteUser )

module.exports = router;