 const {AppError} = require('../utils/errorHandler');

const validateFactory = (schema, object) => (req, res, next) => {
    const result = schema.safeParse(req[object]);
    
    if (!result.success) {
        next(new AppError("Validation failed", 400, {
            errors: result.error.issues
        }));
    } else {
        next();
    }
}

module.exports = {validateFactory};