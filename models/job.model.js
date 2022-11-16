const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    auteurId: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    candidat: {
      type: [
        {
          candidatId: String,
          candidatIdentifiant: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
    likers: {
      type: [String],
      required: true,
    },
    titre: {
      type: String,
      maxlength: 140,
      required: true,
      trim: true,
    },
    entreprise: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      maxlength: 140,
      required: true,
    },
    projet: {
      type: String,
      maxlength: 140,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      //   minlength: 400,
      required: true,
      trim: true,
    },
    profil: {
      type: String,
      required: true,
      //   minlength: 140,
      trim: true,
    },
    competence: {
      type: String,
      required: true,
    },
    tjm: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("job", JobSchema);
