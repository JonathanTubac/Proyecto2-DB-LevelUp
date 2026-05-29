import prisma from '../config/prisma.js';

// ORM CRUD — Categorias

export const findAll = async ({ limit, offset, nombre }) => {
    const where = nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : {};

    const [data, total] = await Promise.all([
        prisma.categorias.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { nombre: 'asc' },
        }),
        prisma.categorias.count({ where }),
    ]);

    return { data, total };
};

export const findById = async (id) => {
    return await prisma.categorias.findUnique({ where: { id } });
};

export const create = async ({ name }) => {
    return await prisma.categorias.create({ data: { nombre: name } });
};

export const update = async (id, { name }) => {
    return await prisma.categorias.update({
        where: { id },
        data: { nombre: name },
    });
};
