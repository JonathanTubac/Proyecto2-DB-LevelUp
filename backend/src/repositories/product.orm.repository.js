import prisma from '../config/prisma.js';

// ORM CRUD — Productos (operaciones básicas sin transacciones)

const toShape = (p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: Number(p.precio),
    stock: p.stock,
    activo: p.activo,
    id_categoria: p.id_categoria,
    categoria: p.categoria?.nombre ?? null,
});

export const findAll = async ({ limit, offset, category, name, showAll = false }) => {
    const where = {
        ...(showAll ? {} : { activo: true }),
        ...(category ? { id_categoria: parseInt(category) } : {}),
        ...(name ? { nombre: { contains: name, mode: 'insensitive' } } : {}),
    };

    const [data, total] = await Promise.all([
        prisma.productos.findMany({
            where,
            include: { categoria: { select: { nombre: true } } },
            skip: offset,
            take: limit,
            orderBy: { nombre: 'asc' },
        }),
        prisma.productos.count({ where }),
    ]);

    return { data: data.map(toShape), total };
};

export const findById = async (id) => {
    const p = await prisma.productos.findUnique({
        where: { id },
        include: { categoria: { select: { nombre: true } } },
    });
    return p ? toShape(p) : null;
};

export const create = async ({ name, price, stock, id_category }) => {
    const p = await prisma.productos.create({
        data: {
            nombre: name,
            precio: price,
            stock,
            id_categoria: id_category,
        },
        include: { categoria: { select: { nombre: true } } },
    });
    return toShape(p);
};

export const update = async (id, { name, price, stock, id_category }) => {
    try {
        const p = await prisma.productos.update({
            where: { id },
            data: {
                nombre: name,
                precio: price,
                stock,
                id_categoria: id_category,
            },
            include: { categoria: { select: { nombre: true } } },
        });
        return toShape(p);
    } catch {
        return null;
    }
};
