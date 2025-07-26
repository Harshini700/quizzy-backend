const express=require('express');
const router=express.Router();
const{getSummary}=require('../controllers/analyticsController')
const verifyToken = require('../middleware/authMiddleware');

router.get('/summary/user',verifyToken,getSummary);
module.exports=router;