const router = require("express").Router();
const companyController = require("../controllers/company.controller");
// const uploadController = require("../controllers/upload.controller");
// const multer = require("multer");
// const upload = multer();

router.get("/", companyController.readCompany);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.editCompany);
router.delete("/:id", companyController.deleteCompany);
router.patch("/like-company/:id", companyController.likeCompany);
router.patch("/unlike-company/:id", companyController.unlikeCompany);

// upload pp
// router.post("/upload", upload.single("file"), uploadController.uploadCompany);

module.exports = router;
