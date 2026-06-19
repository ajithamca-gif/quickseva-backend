import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express. Router();

//Single file upload
router.post("/single", authMiddleware, 
    upload.single("file"), (req, res) =>{
        try{
            if(!req.file){
                return res.status(400).json({message: "No file uploaded"});

            }
            res.json({
                message: "file uploaded successfully",
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
            });

        }catch (error){
            res. status(500).json({ message: error.message});

            }
        });

        //multiple files upload
        router.post("/multiple", authMiddleware, upload.array("files", 5),
    (req, res) => {
        try{
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    message: "No files uploaded"
                })
                
            }
            const files = req.files.map(file => ({
                filename: file.filename,
                path:`uploads/${file.filename}`,
            }));
            res.json({
                message:"Files uploaded successfully",
                files,
            });

        }catch (error){
            res.status(500).json({message: error.message});

        }
    });
    


export default router