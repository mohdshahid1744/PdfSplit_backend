import mongoose from 'mongoose';
import userModel from '../Model/userModel.js'
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto'
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
let access_key = process.env.USER_ACCESS_KEY;
let secret_key = process.env.USER_SECRET_KEY;
let bucket_name = process.env.BUCKET_NAME;

const s3 = new S3Client({
  credentials: {
    accessKeyId: access_key || '',
    secretAccessKey: secret_key || ''
  },
  region: process.env.BUCKET_REGION
});

const uploadPdf=async(req,res)=>{
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'PDF file is required' });
          }
          if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'PDF file must be a PDF' });
          }
        const pdf = randomImageName()
        const params = {
            Bucket: bucket_name,
            Key: pdf,
            Body: req.file.buffer, 
            ContentType: req.file.mimetype, 
        }
       
        const command = new PutObjectCommand(params)
        await s3.send(command);
        const newPdfRecord = new userModel({
            pdf: pdf, 
            uploadDate: new Date(), 
        });
        await newPdfRecord.save();

        res.status(200).json({ message: 'PDF uploaded and saved successfully',data: {
            userId: newPdfRecord._id,
            pdf: pdf,
            uploadDate: newPdfRecord.uploadDate,
        } });
    } catch (error) {
        console.error("Failed to upload pdf",error);
         
     }
}
const getPdf = async (req, res) => {
  try {
      const { id } = req.params;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid ID' });
      }

      const user = await userModel.findById(id);
      if (!user || !user.pdf) {
          return res.status(404).json({ message: 'User or PDF not found' });
      }

      const getObjectParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: user.pdf,
      };
 
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const data = await s3.send(getObjectCommand);
      res.setHeader('Content-Type', 'application/pdf');
      data.Body.pipe(res);
  } catch (error) {
      console.error("Failed to get PDF", error);
      res.status(500).json({ message: 'Failed to retrieve PDF' });
  }
};



export default{
    uploadPdf,
    getPdf
}