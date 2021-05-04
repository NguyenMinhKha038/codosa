import { check, validationResult } from 'express-validator';

const checkEmail = ()=>{
    
    check('email').isEmail().withMessage('Must be a Email')


};
const checkAddress =()=>{
    check('address').isLength({min:10,max:50}).withMessage('Address must be more than 10 chars')
}
const checkID = ()=>{
    check('_id').isString().withMessage('ID must be a String')
}
export default {checkEmail,checkAddress,checkID}