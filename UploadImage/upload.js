const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

cloudinary.config({
  cloud_name: "dftxzejur",
  api_key: "898869341729411",
  api_secret: "z5ZV2lKjAE0PUiyCvjvqjGMzB3w",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // folder name in Cloudinary
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => `${file.fieldname}_${Date.now()}`, // generated file name
  },
});

// Initialize multer with Cloudinary storage configuration
const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Upload file to Cloudinary
  cloudinary.uploader.upload(
    req.file.path,
    { folder: "uploads" },
    (error, result) => {
      if (error) {
        console.error("Upload to Cloudinary failed:", error);
        return res.status(500).send("Upload to Cloudinary failed");
      }

      return res.status(200).json({
        Status: "Success",
        image_url: result.secure_url, // Cloudinary URL
      });
    }
  );
};

module.exports = {
  upload,
  uploadFile,
};
