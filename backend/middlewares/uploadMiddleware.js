import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `${name}-${uniqueSuffix}`;
    },
    allowed_formats: ["jpeg", "png", "jpg", "webp"],
  },
});

const upload = multer({ storage: storage });

export default upload;
