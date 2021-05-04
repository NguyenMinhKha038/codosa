import { check, validationResult } from 'express-validator';

const checkNameSearch =()=>{
    check('name').isLength({min:1,max:20}).withMessage("Product's Name must less than 30 and greater than 1 characters")
}
export default {checkNameSearch};