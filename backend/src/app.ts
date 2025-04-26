import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs";

import customerUserRoutes from './features/customer/routes/user.routes';
import customerProductRoutes from "./features/customer/routes/product.routes";
import customerCartRoutes from "./features/customer/routes/cart.routes";
import customerOrderRoutes from "./features/customer/routes/order.routes";

import merchantUserRoutes from "./features/merchant/routes/user.routes";
import merchantProductRoutes from "./features/merchant/routes/product.routes";
import merchantOrdrerRoutes from "./features/merchant/routes/order.routes";

import { apiErrorHandler, unmatchedRoutes } from './middleware/api-error.middleware';
import { pinoLogger, loggerMiddleware } from './middleware/pino-logger';
import { rateLimiter } from './middleware/security.middleware';

const app: Application = express();
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Security middleware
app.use(rateLimiter);
app.use(helmet());

// Global Middlewares
app.use(express.json());
app.use(cors()); // Enables CORS

// TODO: logger
app.use(loggerMiddleware);
app.use(pinoLogger);
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/heartbeat', (req: Request, res: Response): void => {
  req.log.info('Heartbeat ok');
  res.send('ok');
  return;
});

// API Routes
app.use('/api/v1/customer/users', customerUserRoutes);
app.use('/api/v1/customer/products', customerProductRoutes);
app.use('/api/v1/customer/cart', customerCartRoutes);
app.use('/api/v1/customer/orders', customerOrderRoutes);

app.use("/api/v1/merchant/users", merchantUserRoutes);
app.use("/api/v1/merchant/products", merchantProductRoutes);
app.use("/api/v1/merchant/orders", merchantOrdrerRoutes);

// Error Handling Middleware (Optional)
// For prisma error and other error
app.use(apiErrorHandler);

// Middleware for handling unmatched routes
app.use(unmatchedRoutes);

export { app };
