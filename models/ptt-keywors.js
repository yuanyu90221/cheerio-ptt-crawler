const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getConnection } = require('./db');
const conn = getConnection();
const PTTKeywordsSchema = new Schema({
  boardName: { type: String },
  keywords: [String],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.PTTKeywords = conn.model('PTTKeywords', PTTKeywordsSchema);
