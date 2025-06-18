//for defining routes for /upload-pdf and /ask
const express = require("express");
const multer = require("multer");
const {
  handlePDFUpload,
  handleTextQuery,
} = require("../controllers/aiController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-pdf", upload.single("file"), handlePDFUpload);
router.post("/ask", handleTextQuery);

module.exports = router;
