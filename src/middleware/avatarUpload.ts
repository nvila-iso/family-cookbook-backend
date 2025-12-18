import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function imageOnlyFilter(_req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
    return;
  }
  cb(null, true);
}

export const avatarUpload = multer({
  storage,
  fileFilter: imageOnlyFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
