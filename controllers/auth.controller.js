const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = async (req, res) => {
  const { identifiant, nom, prenom, email, tel, password, fonction, salary } =
    req.body;

  try {
    const user = await UserModel.create({
      identifiant,
      nom,
      prenom,
      email,
      tel,
      password,
      fonction,
      salary,
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
      salary: "",
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

    if (err.message.includes("salary"))
      errors.salary = "Ton salaire n'est pas renseigné";

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

module.exports.logOut = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
