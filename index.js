import express from "express";
import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import { getFileSize } from "./utils.js";
import fs from "fs";
const app = express();
const port = 3001;
// set the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const uploadFolder = "./uploads";
const compressedFolder = "./compressed";

// delete old folder to free space
const deleteOldFolders = (path) => {
    fs.rmdirSync(path, { recursive: true });
};
// create new folder to store recent image
const createNewUploadsFolder = (path) => {
    fs.access(path, (err) => {
        if (err) {
            fs.mkdirSync(path);
        }
    });
};
// initial upload folder
createNewUploadsFolder(uploadFolder);

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

// set the upload middleware
const upload = multer({ storage: storage });
// set the route

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});
app.post("/uploads", upload.single("image"), async (req, res) => {
    const data = await compress(req.file.path);
    console.log(data);
    deleteOldFolders(uploadFolder);
    deleteOldFolders(compressedFolder);
    createNewUploadsFolder(uploadFolder);
    res.send({
        message: "success",
        data: data,
    });
});

// compress image using imagemin
const compress = async (filePath, min = 0.5, max = 0.5) => {
    try {
        const file = await imagemin([filePath], {
            destination: compressedFolder,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [min, max],
                }),
            ],
        });
        const sizeAfterCompress = getFileSize(file[0].destinationPath);
        return {
            base64: file[0].data.toString("base64").slice(0, 100),
            sizeBeforeCompress: getFileSize(filePath),
            sizeAfterCompress: sizeAfterCompress,
        };
    } catch (e) {
        console.log(e);
    }
};
