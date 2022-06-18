import fs from "fs";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";

export function getFileSize(filePath) {
    let finalFileSize;
    const stats = fs.statSync(filePath);

    const fileSize = stats.size;

    if (fileSize < 1000000) {
        finalFileSize = roundOff(fileSize * 0.001) + "kb";
    } else if (fileSize > 1000000 && fileSize < 1000000000) {
        finalFileSize = roundOff(fileSize * 0.000001) + "mb";
    } else {
        finalFileSize = roundOff(fileSize * 0.000000001) + "gb";
    }
    return finalFileSize;
}
const roundOff = (value) => {
    // toFixed() rounds the number and allow 2 numbers after decimal point
    return value.toFixed(2);
};

const compressedFolder = "./compressed";
export const compressImage = async (filePath, min = 0.5, max = 0.5) => {
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

        const sizeBeforeCompress = getFileSize(file[0].sourcePath);
        const sizeAfterCompress = getFileSize(file[0].destinationPath);
        return {
            base64: file[0].data.toString("base64"),
            sizeBeforeCompress: sizeBeforeCompress,
            sizeAfterCompress: sizeAfterCompress,
        };
    } catch (e) {
        console.log(e);
    }
};
