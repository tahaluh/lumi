import multer from "multer";
import path from "path";

const uploadsDir = path.resolve(__dirname, "../../uploads");

export const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadsDir);
    },
    filename: function (req, file, callback) {
        const time = new Date().getTime();
        callback(null, `${time}_${file.originalname}`);
    },
});
