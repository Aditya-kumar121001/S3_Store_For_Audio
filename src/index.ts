import { config } from "dotenv";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

config();

const s3Client = new S3Client({ region: "ap-south-1" });
const bucketName = `chhpay-audio-store`;

const upload = async (filePath: string) => {
    try{
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File not found at path: ${filePath}`);
            return;
        }

        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        console.log(`Reading ${fileName}...`);
        
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: `audio/${fileName}`,
                Body: fileContent
            })
        )
        console.log(`Successfully uploaded ${fileName} to S3 bucket '${bucketName}/audio/'!`);
    } catch(e){
        console.error("Upload failed with error:", e);
    }
};

const download = async (key: string, downloadPath: string) => {
    try {
        console.log(`Downloading object '${key}' from S3...`);
        
        const response = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        if (response.Body) {
            const data = await response.Body.transformToByteArray();
            fs.writeFileSync(downloadPath, Buffer.from(data));
            console.log(`Successfully downloaded and saved to: ${downloadPath}`);
        } else {
            console.error("No content in S3 object body.");
        }
    } catch(e) {
        console.error("Download failed with error:", e);
    }
};

(async () => {
    // 1. Upload Example
    console.log("Starting S3 upload process...")
    await upload("./src/sample1.wav")
    
    console.log("\nStarting S3 download process...")
    await download("audio/sample1.wav", "./downloaded_sample1.wav")
    
    console.log("\nProcess finished.")
})();
