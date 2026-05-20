import * as userRepo from '../repositories/user.repository.js'
import * as roleRepo from '../repositories/role.repository.js'
import { ConfictError, NotFoundError } from '../utils/errors.js'
import bcrypt from 'bcrypt'
import { getPagination } from '../utils/pagination.js';

export const getUsers = async (query) => {
    const { page, limit, offset } = getPagination(query);
    const { rol } = query;

    return await userRepo.findAll({ limit, offset, rol });
};

export const getUserById = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found!');
    return user;
};

export const registerUser = async ({ name, email, password, phone }) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) throw new ConfictError('Email already in use!')

    const role = await roleRepo.findByName('Cliente')

    const hashed = await bcrypt.hash(password, 12);

    return await userRepo.create({ name, email, password: hashed, phone, role_id: role.id });
};

export const updateUser = async (id, { name, email, phone, role_id }) => {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('This user doesnt exist!')

    if (role_id) {
        const role = await roleRepo.findById(role_id)
        if (!role) throw new NotFoundError('That role doesnt exist!')
    }

    return await userRepo.updateById(id, {
        name: name ?? user.name,
        email: email ?? user.email,
        phone: phone ?? user.phone,
        role_id: role_id ?? user.role_id,
    });
};

export const deleteUser = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('This user doesnt exist!');
    return userRepo.deleteById(id);
};

export const activateUser = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('This user doesnt exist!');
    return userRepo.activateById(id);
};

