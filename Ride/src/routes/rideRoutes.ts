const router = require('express').Router();
import RiderController from '../controller/riderController';
import errorHandler from '../services/catchAsyncErrror';



router.route('/request-ride').post( errorHandler( RiderController.requestRide ) );


export default router;