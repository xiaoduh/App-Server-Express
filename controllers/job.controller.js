const jobModel = require("../models/job.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const CompanyModel = require("../models/company.model");
const JobModel = require("../models/job.model");

module.exports.readJob = (req, res) => {
  JobModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to fetch data: " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createJob = async (req, res) => {
  const newJob = new jobModel({
    companyId: req.body.companyId,
    titre: req.body.titre,
    service: req.body.service,
    projet: req.body.projet,
    description: req.body.description,
    competence: req.body.competence,
    profil: req.body.profil,
    tjm: req.body.tjm,
    candidat: [],
    likers: [],
  });

  try {
    const job = await newJob.save();

    await CompanyModel.findByIdAndUpdate(
      { _id: req.body.companyId },
      {
        $addToSet: { jobs: job._id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    return res.status(201).json(job);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editJob = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  const editRecord = {
    titre: req.body.titre,
    entreprise: req.body.entreprise,
    service: req.body.service,
    projet: req.body.projet,
    description: req.body.description,
    profil: req.body.profil,
    competence: req.body.competence,
    tjm: req.body.tjm,
  };

  JobModel.findByIdAndUpdate(
    req.params.id,
    { $set: editRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("edit error :" + err);
    }
  );
};

module.exports.deleteJob = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  JobModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Delete error :" + err);
  });
};

module.exports.likeJob = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    await JobModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    ).then(async (res) => {
      await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likesJob: req.params.id },
        },
        { new: true }
      ).then((docs) => {
        return res.status(201).send(docs);
      });
    });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

module.exports.unlikeJob = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    await JobModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    ).then(async (res) => {
      await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likesJob: req.params.id },
        },
        { new: true }
      ).then((docs) => {
        return res.status(201).send(docs);
      });
    });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// pb d'addtoset de l'id du job dans l'array du user

module.exports.applyJob = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    await JobModel.findByIdAndUpdate(
      req.params.id, //id du job
      {
        $push: {
          candidat: {
            candidatId: req.body.candidatId,
            candidatIdentifiant: req.body.candidatIdentifiant,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      {
        new: true,
      },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { candidatures: req.params.id },
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

module.exports.deleteApply = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknonw : " + req.params.id);

  try {
    return JobModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          candidat: {
            _id: req.body.candidatureId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
