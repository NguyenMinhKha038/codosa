import { check, validationResult } from 'express-validator';
//fromDay, toDay, name
const checkReportProduct = ()=>{
    
    check('fromDay').isISO8601().toDate().withMessage("Invalid date"),
    check('toDay').isISO8601().toDate().withMessage("Invalid date"),
    check('name').isLength({min:2,max:20}).withMessage("Product's Name must less than 20 and greater than 2 characters"),
    check('fromDay', { isBefore : ('toDay' === undefined ) }).isBefore('toDay').withMessage('From Date must be before to Date')
};

const checkReportCategory = ()=>{
    check('fromDay').isISO8601().toDate().withMessage("Invalid date"),
    check('toDay').isISO8601().toDate().withMessage("Invalid date"),
    check('name').isLength({min:3,max:30}).not().isEmpty().withMessage('Category must be a String'),
    check('fromDay', { isBefore : ('toDay' === undefined ) }).isBefore('toDay').withMessage('From Date must be before to Date')
}
export default {checkReportProduct,checkReportCategory}