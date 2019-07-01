const mongoose = require("mongoose");

const techniqueSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    positionMajor: {
      type: String,
      required: "What is the major position?"
    },
    positionMinor: {
      type: String,
      required: "What is the minor position?"
    },
    mode: {
      type: String,
      required: "Is it Gi, No Gi, or both?"
    },
    description: String,
    notes: [{
      type: String
    }],
    steps: [{
      type: String
    }],
    thumbnail: {
      type: String
    },
    video: {
      type: String
    },
    entries: [ this ],
    reactions: [ this ],
    resources: [{
      type: String
    }]
  },
  {
    timestamps: true,
  }
);

techniqueSchema.index(
  {
    name: 'text',
    type: 'text',
    positionMajor: 'text',
    positionMinor: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 10,
      type: 5,
      positionMajor: 5,
      positionMinor: 3,
    },
  }
);

techniqueSchema.pre("remove", async function( next ) {
  try {
    let user = await mongoose.model("User").findById( this.user );
    //Must reference model via mongoose.model to avoid cyclic dependency, because User model also references Techniques and Sequences
    user.techniques.remove( this.id );

    await user.save();

    return next();
  } catch ( err ) {
    return next( err );
  }
});

const Technique = mongoose.model("Technique", techniqueSchema);

module.exports = Technique;