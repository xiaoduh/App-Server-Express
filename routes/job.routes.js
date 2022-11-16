const router = require("express").Router();
const jobController = require("../controllers/job.controller");
const multer = require("multer");
const upload = multer();

router.get("/", jobController.readJob);
router.post("/", jobController.createJob);
router.put("/:id", jobController.editJob);
router.delete("/:id", jobController.deleteJob);
router.patch("/like-job/:id", jobController.likeJob);
router.patch("/unlike-job/:id", jobController.unlikeJob);

// candidatures
router.patch("/candidature-job/:id", jobController.applyJob);
router.patch("/delete-candidature/:id", jobController.deleteApply);

module.exports = router;
