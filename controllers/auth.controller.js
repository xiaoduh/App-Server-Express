const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const sendEmail = require("../utils/sendEmail.utils");
const Joi = require("joi");
const crypto = require("crypto");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = async (req, res) => {
  const { identifiant, nom, prenom, tel, fonction, salaire, email, password } =
    req.body;

  try {
    const user = await UserModel.create({
      identifiant,
      nom,
      prenom,
      tel,
      fonction,
      salaire,
      email,
      password,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    let errors = {
      identifiant: "",
      email: "",
      tel: "",
      password: "",
      nom: "",
      prenom: "",
      fonction: "",
      salaire: "",
    };

    if (
      err.code === 11000 &&
      Object.keys(err.keyValue)[0].includes("identifiant")
    )
      errors.identifiant = "Ton identifiant est déjà utilisé";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Un compte existe déjà avec cet email";

    if (err.message.includes("password"))
      errors.password =
        "Ton password est trop court, il doit faire 6 caractères minimum";

    if (err.message.includes("tel"))
      errors.tel = "Ton téléphone n'est pas renseigné";

    if (err.message.includes("nom")) errors.nom = "Ton nom n'est pas renseigné";

    if (err.message.includes("prenom"))
      errors.prenom = "Ton prénom n'est pas renseigné";

    if (err.message.includes("fonction"))
      errors.fonction = "Ta fonction n'est pas renseignée";

    if (err.message.includes("salaire"))
      errors.salaire = "Ton salaire n'est pas renseigné";

    res.status(200).json({ errors });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    let errors = { email: "", password: "" };

    if (err.message.includes("email")) errors.email = "Email inconnu";

    if (err.message.includes("password"))
      errors.password = "Le mot de passe ne correspond pas";
    res.status(200).json({ errors });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    // const schema = Joi.object({ email: Joi.string().email().required() });
    // const { error } = schema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send("Il n'existe aucun compte correspondant à cette adresse email");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:3000/reset-password/${user._id}/${token.token}`;
    await sendEmail(
      user.email,
      "Ta demande de changement de mot de passe sur Tekos",
      link
    );

    res.send("Un email t'as été envoyé à l'adresse Email renseignée");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    // const schema = Joi.object({ password: Joi.string().required() });
    // const { error } = schema.validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

// module.exports.validateLink = async (req, res) => {
//   // show password reset form ou msg : le lien a expiré
//   try {
//     const user = await UserModel.findOne({ _id: req.params.id });
//     if (!user) return res.status(400).send({ message: "Invalid link" });

//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) return res.status(400).send({ message: "Invalid token" });

//     res.status(200).send({ message: "Link validated" });
//   } catch (error) {}
// };

module.exports.logOut = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
