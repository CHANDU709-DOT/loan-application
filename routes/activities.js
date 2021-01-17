const express = require('express');
const authController = require('../controllers/activities');


const router = express.Router();

//User auth
router.post('/login', authController.login);
router.post('/resendotp', authController.resendotp);
router.post('/emailotp', authController.emailotp);
router.post('/profile', authController.profile);
router.post('/workinfo', authController.workinfo);
router.post('/bankinfo', authController.bankinfo);
router.post('/upload' ,authController.upload);
router.post('/documents', authController.documents);
router.post('/emailverify', authController.emailverify);
router.post('/otpverify', authController.otpverify);
router.post('/address', authController.address);
router.post('/logout', authController.logout);
router.post('/loan', authController.loan);
router.post('/delete', authController.delete);
router.post('/viewpages', authController.viewpages);
router.post('/withdraw', authController.withdraw);

module.exports = router;