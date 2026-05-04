import { Router } from 'express'
import * as ctrl from '../controllers/wallet.controllers.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js';
import { walletAmountSchema } from '../schemas/wallet.schema.js';

const router = Router();

/**
 * @swagger
 * /api/v1/wallets:
 *   get:
 *     summary: Obtener todas las wallets (paginado)
 *     tags: [Wallets]
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
 *         description: Lista de wallets con paginación
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
 *                         wallets:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Wallet'
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
 * /api/v1/wallets/wallet:
 *   get:
 *     summary: Obtener la wallet del usuario autenticado
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet del usuario
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/wallet', protect, ctrl.getMyWallet);

/**
 * @swagger
 * /api/v1/wallets/{id}:
 *   get:
 *     summary: Obtener wallet por ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la wallet
 *     responses:
 *       200:
 *         description: Wallet encontrada
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Wallet'
 *       404:
 *         description: Wallet no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', protect, authorize('Administrador'), ctrl.getById);

/**
 * @swagger
 * /api/v1/wallets/{id}:
 *   put:
 *     summary: Actualizar monto de wallet por ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 maximum: 10000
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Wallet actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Wallet no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', protect, authorize('Administrador'), validate(walletAmountSchema), ctrl.updateById);

/**
 * @swagger
 * /api/v1/wallets/recharge:
 *   post:
 *     summary: Recargar saldo en la wallet del usuario autenticado
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 maximum: 10000
 *                 example: 200.00
 *     responses:
 *       200:
 *         description: Saldo recargado exitosamente
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
router.post('/recharge', protect, validate(walletAmountSchema), ctrl.recharge);

/**
 * @swagger
 * /api/v1/wallets/purchase:
 *   post:
 *     summary: Realizar pago con wallet del usuario autenticado
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 maximum: 10000
 *                 example: 150.00
 *     responses:
 *       200:
 *         description: Pago realizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Saldo insuficiente o error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/purchase', protect, validate(walletAmountSchema), ctrl.purchase);


export default router;
