import fs from "fs";
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
