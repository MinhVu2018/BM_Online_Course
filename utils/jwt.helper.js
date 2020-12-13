const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
            name: user.userName,
            email: user.email,
            role: user.type
        }
        jwt.sign(
            {data: userData},
            secretSignature, 
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    }); 
}

let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decode) => {
            if (error) {
                return reject(error);
            }
            resolve(decode);
        });
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};