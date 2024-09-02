import express from 'express'
const router = express.Router()
import multer from 'multer'
import userController from '../../Controller/userController.js'


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/upload',  upload.single("pdf"), userController.uploadPdf); 
router.get('/getPdf/:id', userController.getPdf);
export default router 