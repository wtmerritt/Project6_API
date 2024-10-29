const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const sauceController = require("../controllers/sauce");
const multer = require('../middleware/multer-config');


router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


router.get("/", auth, sauceController.getAllSauces);
router.post("/", auth, multer, sauceController.createSauce);
router.get("/:id", auth, sauceController.getOneSauce);
router.put("/:id", auth, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);

module.exports = router;
