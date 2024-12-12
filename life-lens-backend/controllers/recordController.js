const { saveRecord, getRecords } = require('../models/recordModel');

exports.createRecord = async (req, res) => {
  try {
    const record = await saveRecord(req.body);
    res.status(201).json({ message: '記錄已成功儲存', record });
  } catch (error) {
    res.status(500).json({ error: '儲存失敗', details: error.message });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const records = await getRecords();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: '無法取得記錄', details: error.message });
  }
};
