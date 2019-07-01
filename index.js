require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const techniquesRoutes = require("./routes/techniques");
const sequenceRoutes = require("./routes/sequences");
const openTechniquesRoutes = require("./routes/openTechniques");
const openSequencesRoutes = require("./routes/openSequences");
const addRefRoutes = require("./routes/addRef");
const likeRoutes = require("./routes/like");
const sendMessageRoutes = require("./routes/sendMessage");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

// all routes below

//Routes that require authorization and / or authentication

app.use(
  "/api/auth/updateuser/:id",
  loginRequired,
  ensureCorrectUser,
  authRoutes 
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/users/:id/techniques",
  loginRequired,
  ensureCorrectUser,
  techniquesRoutes
);

app.use(
  "/api/users/:id/sequences",
  loginRequired,
  ensureCorrectUser,
  sequenceRoutes
)

app.use(
  "/api/users/:id/techniqueRefs",
  loginRequired,
  addRefRoutes
)

app.use(
  "/api/users/:id/like",
  loginRequired,
  likeRoutes
)

app.use(
  "/api/users/:id/",
  loginRequired,
  sendMessageRoutes
)

// Routes that do not require authentication or authorization

app.use(
  "/api/techniques",
  openTechniquesRoutes
)

app.use(
  "/api/sequences",
  openSequencesRoutes
)

app.use(
  '/api/resetpassword',
  sendMessageRoutes
)

app.use( function( req, res, next ){
  let err = new Error( "Page Not Found" );
  err.status = 404;
  next( err );
});

app.use( errorHandler );

app.listen( PORT, function() {
  console.log(`Server is starting on port ${ PORT }`);
});