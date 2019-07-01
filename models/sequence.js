const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 500,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    description: String,
    techniques: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technique"
    }],
    notes: [{
      type: String
    }],
    thumbnail: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

sequenceSchema.index(
  {
    name: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 10,
    },
  }
);

sequenceSchema.pre("remove", async function( next ) {
  try {
    let user = await mongoose.model("User").findById( this.user ); //Must reference model via mongoose.model to avoid cyclic dependency, because User model also references Techniques and Sequences
    user.sequences.remove( this.id );

    await user.save();
    
    return next();
  } catch ( err ) {
    return next( err );
  }
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

module.exports = Sequence;