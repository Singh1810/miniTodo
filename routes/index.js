const express = require('express');
const router = express.Router();
const todoModel = require('../models/todo.model');
// import UserController from '../controllers/userController';

router.get('/', function (req, res, next) {
  res.render('index', { title: 'ToDoApp'});
});


module.exports = router;
