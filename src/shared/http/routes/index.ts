import productsRouter from '@modules/products/routes/products.routes';

import {Router} from 'express';
import userRouter from '@modules/users/routes/users.routes';
import sessionsRouter from '@modules/users/routes/sessions.routes';
import customerRouter from '@modules/customers/routes/customers.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';
import ordersRouter from '@modules/orders/routes/orders.routes';
import employeeRouter from  '@modules/employee/routes/employee.routes';
const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/customers', customerRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/orders', ordersRouter);
routes.use('/employee', employeeRouter);
export default routes;
