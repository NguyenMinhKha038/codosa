import { check, validationResult } from 'express-validator';
//name, amount, price, categoryName, description
const checkAddProduct = ()=>{
    
    check('name').isLength({min:2,max:20}).withMessage("Product's Name must less than 20 and greater than 2 characters"),
    check('amount').isNumeric().withMessage("Product's amount must a Number"),
    check('price').isNumeric().withMessage("Product's price must a Number"),
    check('categoryName').isLength({min:2,max:20}).withMessage("Product's categoryName must less than 20 and greater than 2 characters"),
    check('description').isLength({min:2,max:200}).withMessage("Product's discription must less than 200 and greater than 2 characters")


};
//name,
const checkNameProduct =()=>{
    check('name').isLength({min:2,max:20}).withMessage("Product's Name must less than 30 and greater than 2 characters")
}
//name, amount, price, newName 
const checkUpdateProduct = ()=>{
    check('name').isLength({min:2,max:20}).withMessage("Product's Name must less than 20 and greater than 2 characters"),
    check('amount').isNumeric().withMessage("Product's amount must a Number"),
    check('price').isNumeric().withMessage("Product's price must a Number"),
    check('newName').isLength({min:2,max:20}).withMessage("Product's Name must less than 20 and greater than 2 characters")
}
export default {checkAddProduct,checkNameProduct,checkUpdateProduct}