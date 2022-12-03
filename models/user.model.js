const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    identifiant: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 55,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 55,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    tel: {
      type: String,
      required: true,
      max: 10,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    fonction: {
      type: String,
      required: true,
      maxlength: 55,
    },
    bio: {
      type: String,
      maxlength: 140,
    },
    salary: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    missions: {
      type: [String],
    },
    candidatures: {
      type: [String],
    },
    followingCompany: {
      type: [String],
    },
    likesJob: {
      type: [String],
    },
    jobPosted: {
      type: [String],
    },
    admin: {
      type: Boolean,
      default: false,
      required: true,
    },
    superAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into db

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("inccorect email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
