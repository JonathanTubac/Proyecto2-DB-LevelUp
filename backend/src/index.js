import express from 'express'
import 'dotenv/config'
import { connect } from './config/db.js'
import helmet from 'helmet';
import cors from 'cors';

//Middlewares imports
import errorMiddleware from './middlewares/error.middleware.js'
import { apiLimiter, authLimiter } from './middlewares/rateLimit.middleware.js';
import { requestLogger } from './middlewares/logger.middleware.js';

//Routes imports
import userRouters from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import producRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import walletRoutes from './routes/wallet.routes.js'
import purchaseRoutes from './routes/compra.routes.js'
import providerRoutes from './routes/provider.routes.js'
import provideRoutes from './routes/provide.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js';

import swaggerSpec from './config/swagger.js';
import swaggerUi from 'swagger-ui-express'

const app = express()
const port = process.env.PORT || 3000

// SECURITY
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': ["'self'", "'unsafe-inline'"],
            'img-src': ["'self'", 'data:', 'https:'],
        },
    },
}));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

//BODYPARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
//HEATLH ROUTE
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
})

//API LIMITER
app.use('/api/', apiLimiter);
app.use('/api/v1/auth', authLimiter);

//API ROUTES
app.use('/api/v1/users', userRouters);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', producRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/provide', provideRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'LevelUp API Docs',
    swaggerOptions: { persistAuthorization: true },
}))

//404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `route ${req.method} ${req.url} doesnt exist!`
        }
    })
})

//ERROR MIDDLEWARE
app.use(errorMiddleware)

//DB CONNECTION
await connect()

//SERVER START
app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`)
})