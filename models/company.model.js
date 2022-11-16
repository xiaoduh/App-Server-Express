const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
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
      required: true,
    },
    jobs: {
      type: [String],
      required: true,
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
      required: true,
    },
    competence: {
      type: [String],
      required: true,
    },
    picture: {
      type: String,
      default: "./uploads/company/random-user.png",
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
