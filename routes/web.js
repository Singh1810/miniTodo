import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';

router.get('/',UserController.home);
router.get('/registration',UserController.registration);
router.post('/registration',UserController.createUserDoc);
router.get('/login',UserController.login);
router.post('/login',UserController.verifyLogin);
router.get('/add', UserController.addTask);
router.post('/add', UserController.add);
router.get('/display', UserController.display);
router.get('/delete/:id', UserController.delete);
router.get('/edit/:id', UserController.edit);
router.post('/edit/:id', UserController.editTask);
router.get('/search', UserController.search);
 
export default router;