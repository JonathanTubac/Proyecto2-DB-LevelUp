import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LevelUp API',
            version: '1.0.0',
            description: 'API REST para la tienda LevelUp',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // respuesta de éxito genérica
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' },
                    },
                },
                // respuesta de error genérica
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', example: 'NOT_FOUND' },
                                message: { type: 'string', example: 'Resource not found' },
                            },
                        },
                    },
                },
                // paginación
                Pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 100 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 10 },
                        hasNext: { type: 'boolean', example: true },
                        hasPrev: { type: 'boolean', example: false },
                    },
                },
                // modelos
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'Juan García' },
                        correo: { type: 'string', example: 'juan@gmail.com' },
                        telefono: { type: 'string', example: '12345678' },
                        activo: { type: 'boolean', example: true },
                        rol: { type: 'string', example: 'Cliente' },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        nombre: { type: 'string', example: 'Nintendo Switch OLED' },
                        precio: { type: 'number', example: 4500.00 },
                        stock: { type: 'integer', example: 15 },
                        activo: { type: 'boolean', example: true },
                        categoria: { type: 'string', example: 'Consolas' },
                    },
                },
                Wallet: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        monto: { type: 'number', example: 1500.00 },
                        fecha_creacion: { type: 'string', example: '2024-01-15T14:32:05' },
                        usuario: { type: 'string', example: 'Juan García' },
                    },
                },
                Purchase: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        tipo: { type: 'string', example: 'en_linea' },
                        fecha: { type: 'string', example: '2024-01-15T14:32:05' },
                        total: { type: 'number', example: 1600.00 },
                        id_usuario: { type: 'integer', example: 4 },
                        id_empleado: { type: 'integer', example: null, nullable: true },
                    },
                },
            },
        },
    },
    // dónde busca los comentarios JSDoc
    apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);