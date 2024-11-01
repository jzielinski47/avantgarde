"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupDataValidationSchema = void 0;
exports.signupDataValidationSchema = {
    username: {
        errorMessage: "Invalid username",
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
        },
        notEmpty: true,
        isString: true,
    },
    email: {
        isEmail: true,
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: "Password should be at least 8 chars",
        },
    },
};
