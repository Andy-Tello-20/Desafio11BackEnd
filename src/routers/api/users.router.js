import { Router } from 'express';

import UserController from '../../controllers/user.controller.js';

const router = Router();

router.get('/users',UserController.getUser );

router.get('/users/:uid', UserController.getUserById);

router.post('/users/', UserController.createNewUser);

router.put('/users/:uid',UserController.updateUser);

router.delete('/users/:uid',UserController.deleteUser);

export default router;