import prisma from '../config/prisma.js';

// ORM CRUD — Proveedores

export const findAll = async ({ limit, offset, nombre, showAll = false }) => {
    const where = {
        ...(showAll ? {} : { activo: true }),
        ...(nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : {}),
    };

    const [data, total] = await Promise.all([
        prisma.proveedores.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { nombre: 'asc' },
        }),
        prisma.proveedores.count({ where }),
    ]);

    return { data, total };
};

export const findById = async (id) => {
    return await prisma.proveedores.findUnique({ where: { id } });
};

export const create = async ({ name }) => {
    return await prisma.proveedores.create({ data: { nombre: name } });
};

export const update = async (id, { name }) => {
    return await prisma.proveedores.update({
        where: { id },
        data: { nombre: name },
    });
};

export const deactivate = async (id) => {
    return await prisma.proveedores.update({
        where: { id },
        data: { activo: false },
    });
};

export const activate = async (id) => {
    return await prisma.proveedores.update({
        where: { id },
        data: { activo: true },
    });
};
