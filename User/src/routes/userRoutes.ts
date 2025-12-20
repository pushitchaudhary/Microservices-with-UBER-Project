const router = require('express').Router();

import userController from "../controller/userController";
import { authenticatedUser } from "../middleware/userAuth";
import catchAsyncError from '../service/catchAsyncErrror';

// User Registration Route
router.route('/register').post(catchAsyncError(userController.registerUser));
// User Login Route
router.route('/login').post(catchAsyncError(userController.loginUser));

// Protected User Profile Route
// router.route('/profile').get(authenticatedUser ,catchAsyncError(userController.getUserProfile));

router.route('/profile').get(userController.testEndpoint);

// Test Endpoint
// router.route('/test').get(userController.testEndpoint)







export default router;
