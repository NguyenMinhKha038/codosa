import express from "express";
import multer from "multer";

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./uploads')
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
})
 
const upload = multer({ storage: storage })

const addSingleImage=async(req,res)=>{
  const img = fs.readFileSync(req.file.path);
  const encode_image = img.toString('base64');
  const finalImg = {
    contentType: req.file.mimetype,
    image:  new Buffer(encode_image, 'base64')
  };
  
  return finalImg;
}
const updateSingleImage=async(req,res)=>{

}
export default {addSingleImage,updateSingleImage};