"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a0369193-8b4d-58d2-b166-75def06dbbbc")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = require("../configs/envConfig");
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue?.[field];
    const message = `Duplicate value for ${field}: ${value}. Please use another value.`;
    return {
        ...err,
        statusCode: 400,
        status: 'fail',
        message,
    };
};
const handleValidationError = (err) => {
    if (err.errors) {
        const errorMessages = [];
        for (const field in err.errors) {
            const fieldError = err.errors[field];
            if (fieldError.kind === 'enum') {
                const validValues = fieldError.properties?.enumValues || [];
                const invalidValue = fieldError.value;
                const message = `Invalid value '${invalidValue}' for field '${field}'. Allowed values are: ${validValues.join(', ')}.`;
                errorMessages.push(message);
            }
            else if (fieldError.name === 'ValidatorError') {
                errorMessages.push(fieldError.message || `Invalid value for field '${field}'.`);
            }
            else if (fieldError.message) {
                errorMessages.push(fieldError.message);
            }
        }
        if (errorMessages.length > 0) {
            const message = errorMessages.join(' ');
            return {
                ...err,
                statusCode: 400,
                status: 'fail',
                message,
            };
        }
        const errors = Object.values(err.errors).map((val) => val.message || 'Validation error');
        const message = `Invalid input data. ${errors.join('. ')}`;
        return {
            ...err,
            statusCode: 400,
            status: 'fail',
            message,
        };
    }
    return err;
};
const sendDevError = (err, res) => {
    res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
};
const sendProdError = (err, res) => {
    res.status(err.statusCode).send({
        status: err.status,
        message: err.message,
    });
};
exports.default = (err, _req, res, next) => {
    const error = { ...err };
    console.error('Error occured 🤯💥:', error);
    console.log(err);
    if (err.code === 11000) {
        err = handleDuplicateKeyError(err);
    }
    if (err.name === 'ValidationError') {
        err = handleValidationError(err);
    }
    err.statusCode = err.statusCode ?? 500;
    err.message = err.message;
    err.status = err.statusCode >= 400 && err.statusCode < 500 ? 'fail' : 'error';
    envConfig_1.NODE_ENV === 'prod' ? sendProdError(err, res) : sendDevError(err, res);
    next();
};
//# sourceMappingURL=errorHandler.js.map
//# debugId=a0369193-8b4d-58d2-b166-75def06dbbbc
