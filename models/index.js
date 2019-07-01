const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

mongoose.connect( 
  process.env.MONGODB_URI || "mongodb://localhost/jj",
  {
  keepAlive: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  }
);

module.exports.User = require("./user");
module.exports.Technique = require("./technique");
module.exports.Sequence = require("./sequence");