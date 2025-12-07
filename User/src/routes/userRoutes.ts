const router = require('express').Router();

import userController from "../controller/userController";
import catchAsyncError from '../service/catchAsyncErrror';

// User Registration Route
router.route('/register').post(catchAsyncError(userController.registerUser));
// User Login Route
router.route('/login').post(catchAsyncError(userController.loginUser));






export default router;
