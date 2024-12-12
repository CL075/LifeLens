const express = require('express');
const { createRecord, getAllRecords } = require('../controllers/recordController');

const router = express.Router();

router.post('/', createRecord);  // 建立記錄
router.get('/', getAllRecords);  // 取得所有記錄

module.exports = router;
