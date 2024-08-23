const multer = require("multer");
const path = require("path");

const destinationPath = path.join(__dirname, "..", "src/avatar");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
 

    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage, fileSize: 1024 * 1024 * 2 });

module.exports = upload;
