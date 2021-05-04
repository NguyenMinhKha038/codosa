import { check, validationResult } from 'express-validator';

const categoryValidate = ()=>{
    
    check('category').isLength({min:3,max:30}).not().isEmpty().withMessage('Category must be a String')

};
const categoryUpdateValidate = ()=>{
    
    check('name').isLength({min:3,max:30}).not().isEmpty().withMessage('Category must be a String'),
    check('Newname').isLength({min:3,max:30}).not().isEmpty().withMessage('Category must be a String')

};


export default {categoryValidate,categoryUpdateValidate}