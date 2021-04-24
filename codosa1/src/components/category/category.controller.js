import category from "./category.model";
import product from "../products/product.model";
const addCategory=async(req,res)=>{
    const categoryName = req.body.category;
    let categorys = new category({
        name:categoryName
      
    })
    try {
        await categorys.save();
        res.status(200).json({massage:"Đã tạo thành công"});
    } catch (error) {
        res.status(400).json({Error:error});
    }
}
const deleteCategory=async(req,res)=>{
    const categorys = req.body.category;
    try {
        await category.findOneAndDelete({name:categorys});
        await product.deleteMany({category:categorys});
        res.status(200).json({message:"Xóa thành công"});
    } catch (error) {
        res.status(400).json({Error:error});
    }
}
const getListCatagory=async(req,res)=>{
    
    const categorys = await category.find({});
    let list=categorys.map(x=>x._id);
    if(list.length==0){
        res.status(200).json({message:"Chưa có category"});
    }
    res.status(200).json({category:categorys});
}
const getAllProduct=async(req,res)=>{
    const category=req.body;
    try {
        const listProduct = await product.findMany({category:category});
        if(listProduct.length==0){
            res.status(200).json({Message:"Không tồn tại sản phẩm nào"});
        }
        res.status(200).json({Product:listProduct});
    } catch (error) {
        res.status(400).json({Error:error})
    }

}
const updateCategory=async(req,res)=>{
    const{name,newName}=req.body;
    try {
        await category.findOneAndUpdate({name:name},{name:newName});
        await product.updateMany({category:name},{category:newName});
        res.status(200).json({message:"Update thành công"});
    } catch (error) {
        res.status(400).json({Error:error});
    }
}
export default {addCategory,deleteCategory,getListCatagory,updateCategory,getAllProduct}