const CompanyModel = require("../models/company.model");
const UserModel = require("../models/user.model");
const JobModel = require("../models/job.model");
const companyModel = require("../models/company.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readCompany = (req, res) => {
  CompanyModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to fetch data: " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createCompany = async (req, res) => {
  const newCompany = new companyModel({
    nom: req.body.nom,
    secteur: req.body.secteur,
    localisation: req.body.localisation,
    description: req.body.description,
    video: req.body.video,
  });

  try {
    const company = await newCompany.save();
    return res.status(201).json(company);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCompany = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  const editRecord = {
    nom: req.body.nom,
    secteur: req.body.secteur,
    localisation: req.body.localisation,
    description: req.body.description,
    competence: req.body.competence,
    video: req.body.video,
  };

  CompanyModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: editRecord,
    },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Edit error" + err);
    }
  );
};

module.exports.deleteCompany = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  CompanyModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error :" + err);
  });
};

module.exports.likeCompany = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    await CompanyModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { followingCompany: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikeCompany = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    await CompanyModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { followingCompany: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
