const router = require('express').Router();
import RiderController from '../controller/riderController';
import { authenticatedUser } from '../middleware/userAuth';
import errorHandler from '../services/catchAsyncErrror';



router.route('/request-ride').post( authenticatedUser, errorHandler(RiderController.requestRide));


export default router;