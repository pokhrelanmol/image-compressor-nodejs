const fs = require("fs");

const getFileSize = (filePath) => {
    let finalFileSize;
    fs.stat(filePath, (err, stats) => {
        if (err) throw Error(err);

        const fileSize = stats.size;
        console.log(fileSize);
        if (fileSize < 1000000) {
            finalFileSize = roundOff(fileSize * 0.001) + "kb";
        } else if (fileSize < 1000000000) {
            finalFileSize = roundOff(fileSize * 0.001 * 0.001) + "mb";
        } else {
            finalFileSize = roundOff(fileSize * 0.001 * 0.001 * 0.001) + "gb";
        }
        console.log(finalFileSize);
    });
};
const roundOff = (value) => {
    // toFixed() rounds the number and allow 2 numbers after decimal point
    return value.toFixed(2);
};
getFileSize("./Screenshot from 2021-08-14 10-21-01.png");
