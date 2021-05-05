import { check, validationResult } from 'express-validator';

const checkEmailNamePass =()=>{
    check('email').isEmail().withMessage("Must be an email"),
    check('name').isLength({max:20,min:2}).withMessage("Name must less than 20 and greater than 2 characters"),
    check('password').isLength({min:1}).withMessage("Paaword is require")
}
const checkEmail = ()=>{
    check('email').isEmail().withMessage("Must be an email")
}
const checkEmailPass = ()=>{
    check('email').isEmail().withMessage("Must be an email"),
    check('password').isLength({min:1}).withMessage("Paaword is require")
}
export default { checkEmailNamePass,checkEmail,checkEmailPass};