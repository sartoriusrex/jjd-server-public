const express = require("express");
const router = express.Router();
const { signup, signin, verifyAccount, verifyToken, resetPassword, updateUser, deleteUser } = require("../handlers/auth");


router.post( "/signup", signup );
router.post( "/signin", signin );
router.get( "/verifyaccount/:accountVerificationToken", verifyAccount );
router.get( "/:token", verifyToken );
router.patch( "/:token", resetPassword );

router.patch( "/updateuser/:userid", updateUser )
router.delete( "/updateuser/:userid", deleteUser )

module.exports = router;