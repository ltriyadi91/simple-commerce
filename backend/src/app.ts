import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import customerUserRoutes from './features/customer/routes/user.routes';
import customerProductRoutes from './features/customer/routes/product.routes';
import customerCartRoutes from './features/customer/routes/cart.routes';
import customerOrderRoutes from './features/customer/routes/order.routes';

import merchantUserRoutes from './features/merchant/routes/user.routes';
import merchantProductRoutes from './features/merchant/routes/product.routes';
import merchantOrdrerRoutes from './features/merchant/routes/order.routes';
import commonImageRoutes from './features/common/routes/image.routes';

import { apiErrorHandler, unmatchedRoutes } from './middleware/api-error.middleware';
import { pinoLogger, loggerMiddleware } from './middleware/pino-logger';
import { rateLimiter } from './middleware/security.middleware';
import { env } from './config/env-config';

const app: Application = express();
if (process.env.NODE_ENV === 'development') {
  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Security middleware
app.use(rateLimiter);
app.use(helmet());

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Exact origin, no wildcard
  credentials: true, // Allow cookies
}));
app.use(cookieParser());
app.use(
  session({
    secret: env.JWT_SECRET, // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Ensures the cookie is accessible only by the web server
      secure: false,  // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    },
  })
);

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

app.use('/api/v1/merchant/users', merchantUserRoutes);
app.use('/api/v1/merchant/products', merchantProductRoutes);
app.use('/api/v1/merchant/orders', merchantOrdrerRoutes);

app.use('/api/v1/common', commonImageRoutes);

// Error Handling Middleware (Optional)
// For prisma error and other error
app.use(apiErrorHandler);

// Middleware for handling unmatched routes
app.use(unmatchedRoutes);

export { app };
