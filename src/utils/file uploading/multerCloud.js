import multer, { diskStorage } from "multer";

export const uploadCloud = (filetype) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (!filetype.includes(file.mimetype))
      cb(
        new Error(
          `Unsupported file type! Expected: ${JSON.stringify(filetype)}`
        ),
        false
      );

    cb(null, true);
  };

  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
};
