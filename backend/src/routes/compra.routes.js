import * as ctrl from '../controllers/compra.controller.js'
import { Router } from 'express'
import { authorize, protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { purchaseSchema, presencialPurchaseSchema } from '../schemas/purchase.schema.js';

const router = Router();

router.get('/report', protect, ctrl.getMyReport);

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: Obtener todas las compras (paginado)
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Registros por página
 *     responses:
 *       200:
 *         description: Lista de compras con paginación
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         purchases:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Purchase'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sin permisos de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, authorize('Administrador', 'Gerente', 'Empleado'), ctrl.getAll);

router.post('/presencial', protect, authorize('Empleado', 'Administrador', 'Gerente'), validate(presencialPurchaseSchema), ctrl.createPresencial);

/**
 * @swagger
 * /api/v1/purchases/my:
 *   get:
 *     summary: Obtener compras del usuario autenticado
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Compras del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         purchases:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Purchase'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my', protect, ctrl.getUserCompras);

/**
 * @swagger
 * /api/v1/purchases/{id}:
 *   get:
 *     summary: Obtener compra por ID
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Purchase'
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', protect, ctrl.getById);

/**
 * @swagger
 * /api/v1/purchases:
 *   post:
 *     summary: Crear nueva compra
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, productos]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [presencial, en_linea]
 *                 example: en_linea
 *               productos:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [id_producto, cantidad]
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                       example: 3
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error de validación o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, validate(purchaseSchema), ctrl.create);

export default router;
