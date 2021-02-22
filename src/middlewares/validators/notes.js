const { body, param, query, validationResult } = require('express-validator/check');

const Note = require('../../models/Note');

function processErrors(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return next({ 
            status: 400, 
            message: 'validation error', 
            errors: err.array() 
        });
    }

    next();
}

async function findNote(value, req) {
    const note = await Note.findById(value).select(`-password`);
    if (!note)
        throw new Error;

    else req.req.foundNote = note;
}

module.exports.create = () => {
    return [
        body('text')
            .exists().bail().withMessage('required')
            .isString().bail().withMessage('should be String')
            .isLength({ min: 1 }).withMessage('min length is 1 character')
            .isLength({ max: 1000 }).withMessage('max length is 1000 characters'),
        //
        processErrors,
    ];
};

module.exports.list = () => {
    return [
        query('page')
            .exists().bail().withMessage('required')
            .isInt().bail().withMessage('should be Integer')
            .isInt({ min: 1 }).bail().withMessage('min is 1')
            .toInt(),
        //
        query('page_size')
            .exists().bail().withMessage('required')
            .isInt().bail().withMessage('should be Integer')
            .isInt({ min: 1 }).bail().withMessage('min is 1')
            .isInt({ max: 30 }).bail().withMessage('max is 30')
            .toInt(),
        //
        processErrors,
    ];
};

module.exports.read = () => {
    return [
        param('mongoId')
            .isMongoId().bail().withMessage('should be MongoDB _id')
            .custom(findNote).withMessage('not found'),
        //
        processErrors,
    ];
};

module.exports.update = () => {
    return [
        param('mongoId')
            .isMongoId().bail().withMessage('should be MongoDB _id')
            .custom(findNote).withMessage('not found'),
        //
        body('text')
            .exists().bail().withMessage('required')
            .isString().bail().withMessage('should be String')
            .isLength({ min: 1 }).withMessage('min length is 1 character')
            .isLength({ max: 1000 }).withMessage('max length is 1000 characters'),
        //
        processErrors,
    ];
};

module.exports.delete = () => {
    return [
        param('mongoId')
            .isMongoId().bail().withMessage('should be MongoDB _id')
            .custom(findNote).withMessage('not found'),
        //
        processErrors,
    ];
};