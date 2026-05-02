import express from 'express'
import 'dotenv/config'
import { connect } from './config/db.js'
import userRouters from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import producRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import walletRoutes from './routes/wallet.routes.js'
import purchaseRoutes from './routes/compra.routes.js'
import providerRoutes from './routes/provider.routes.js'

import errorMiddleware from './middlewares/error.middleware.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() })
})

app.use('/api/v1/users', userRouters);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', producRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/providers', providerRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `route ${req.method} ${req.url} doesnt exist!`
        }
    })
})

app.use(errorMiddleware)

await connect()

app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`)
})