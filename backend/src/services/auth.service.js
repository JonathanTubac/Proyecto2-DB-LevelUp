import * as userRepo from '../repositories/user.repository.js'
import * as authRepo from '../repositories/auth.repository.js'
import bcrypt from 'bcryptjs'
import { generateTokens, verifyToken } from '../utils/jwt.js'
import { NotFoundError, ConfictError, UnauthorizedError } from '../utils/errors.js'

export const register = async ({ name, email, password, phone, role_id }) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) throw new ConfictError('Email already in use')

    const hashed = await bcrypt.hash(password, 12)

    const user = await userRepo.create({ name, email, password: hashed, phone, role_id });

    const tokens = generateTokens(user)

    await authRepo.saveRefreshToken({ userId: user.id, token: tokens.refreshToken });

    return { user, ...tokens }
}

export const login = async ({ email, password }) => {
    const user = await userRepo.findByEmail(email);

    if (!user) throw new UnauthorizedError('Invalid credentials!')

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new UnauthorizedError('Invalid credentials!');

    const { password: _, ...userWithoutPassword } = user;

    const tokens = generateTokens(userWithoutPassword);

    await authRepo.saveRefreshToken({ userId: user.id, token: tokens.refreshToken });

    return { user: userWithoutPassword, ...tokens }
}

export const refresh = async (refreshToken) => {
    if (!refreshToken) throw new UnauthorizedError('Refresh token needed!')

    const saved = await authRepo.findRefreshToken(refreshToken);
    if (!saved) throw new UnauthorizedError('Invalid refresh token!');

    const { userId } = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found!');

    await authRepo.deleteRefreshToken(refreshToken);

    const tokens = generateTokens(user.id);

    await authRepo.saveRefreshToken({ userId: user.id, token: tokens.refreshToken });

    return tokens
}

export const logout = async (refreshToken) => {
    if (!refreshToken) throw new UnauthorizedError('Invalid refresh token!');

    await authRepo.deleteRefreshToken(refreshToken);
}