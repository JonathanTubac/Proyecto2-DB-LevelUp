import jwt from 'jsonwebtoken'

export const generateTokens = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user.id,
            email: user.correo,
            rol: user.rol,
            name: user.nombre
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken }
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};