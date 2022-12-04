const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    secteur: {
      type: String,
      required: true,
      trim: true,
    },
    localisation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 140,
      required: true,
      trim: true,
    },
    likers: {
      type: [String],
    },
    jobs: {
      type: [String],
    },
    contact: {
      type: [
        {
          auteurId: String,
          nom: String,
          prenom: String,
          role: String,
          info: String,
          timestamp: Number,
        },
      ],
    },
    competence: {
      type: [String],
    },
    video: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("company", CompanySchema);
