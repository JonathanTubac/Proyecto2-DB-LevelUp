import { Router } from "express";
import * as ctrl from '../controllers/provide.controller.js'
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { provideSchema, updateProvideSchema } from "../schemas/provide.schema.js";

const router = Router();

/**
 * @swagger
 * /api/v1/provide:
 *   get:
 *     summary: Obtener todos los registros de abastecimiento (paginado)
 *     tags: [Provide]
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
 *         description: Lista de abastecimientos con paginación
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
 *                         records:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               proveedor:
 *                                 type: string
 *                                 example: Nintendo
 *                               producto:
 *                                 type: string
 *                                 example: Nintendo Switch OLED
 *                               cantidad:
 *                                 type: integer
 *                                 example: 50
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
router.get('/', protect, authorize('Administrador'), ctrl.getAll);

/**
 * @swagger
 * /api/v1/provide:
 *   post:
 *     summary: Registrar abastecimiento de un producto por proveedor
 *     tags: [Provide]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_prov, id_prod, amount]
 *             properties:
 *               id_prov:
 *                 type: integer
 *                 example: 1
 *               id_prod:
 *                 type: integer
 *                 example: 3
 *               amount:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Abastecimiento registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, authorize('Administrador'), validate(provideSchema), ctrl.create);

/**
 * @swagger
 * /api/v1/provide/{id}:
 *   put:
 *     summary: Actualizar cantidad de abastecimiento por ID
 *     tags: [Provide]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de abastecimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Abastecimiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Registro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', protect, authorize('Administrador'), validate(updateProvideSchema), ctrl.update);

export default router;
