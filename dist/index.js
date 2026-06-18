"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
(0, dotenv_1.config)();
const s3Client = new client_s3_1.S3Client({ region: "ap-south-1" });
const bucketName = `chhpay-audio-store`;
const upload = async (filePath) => {
    try {
        if (!fs_1.default.existsSync(filePath)) {
            console.error(`Error: File not found at path: ${filePath}`);
            return;
        }
        const fileContent = fs_1.default.readFileSync(filePath);
        const fileName = path_1.default.basename(filePath);
        console.log(`Reading ${fileName}...`);
        await s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: `audio/${fileName}`,
            Body: fileContent
        }));
        console.log(`Successfully uploaded ${fileName} to S3 bucket '${bucketName}/audio/'!`);
    }
    catch (e) {
        console.error("Upload failed with error:", e);
    }
};
(async () => {
    console.log("Starting S3 upload process...");
    await upload("./src/sample1.wav");
    console.log("Process finished.");
})();
