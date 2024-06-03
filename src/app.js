import express from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import indexRouter from './routers/views/index.router.js';
import usersRouter from './routers/api/users.router.js';
import sessionsRouter from './routers/api/sessions.router.js';
import productRouter from './routers/api/products.router.js'
import cartRouter from './routers/api/carts.router.js'
import { __dirname, logger} from './utils.js';
import { init as initPassport } from './config/passport.config.js';

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api', usersRouter, sessionsRouter,cartRouter, productRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;

  logger.error(`ha ocurrido un error ${error}`)

  res.status(500).json({ status: 'error', message });
});

export default app;
