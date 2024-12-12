const express = require('express');
const Record = require('../model/Record.js');
const router = express.Router();

// 创建新记录
router.post('/', async (req, res) => {
  try {
    const records = new Record(req.body);
    await records.save();
    res.status(200).send({ message: "Record saved successfully!" });
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).send({ message: "Error saving record", error: error.message });
  }
});

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
