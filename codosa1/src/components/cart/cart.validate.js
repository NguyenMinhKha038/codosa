import { check, validationResult } from 'express-validator';

const cartValidate = ()=>{
    
    check('productname').isLength({min:3,max:30}).withMessage('ProductName must be a String'),
    check('amount').isNumeric().withMessage('Amount is a Number')

};


export default {cartValidate}