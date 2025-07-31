import express from "express";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", (req, res) => {
  const uploadSingleImage = upload.single("images");
  uploadSingleImage(req, res, (err) => {
    if (err) {
      // The error from Cloudinary/Multer will be here
      return res
        .status(400)
        .send({ message: err.message || "File upload failed." });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: req.file.path, // The `path` property from cloudinary-storage is the URL
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;
