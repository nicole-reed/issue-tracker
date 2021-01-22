const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  created_on: Date,
  updated_on: Date,
  open: { type: Boolean, default: true },
  status_text: ''
});

const Issue = mongoose.model('Issue', issueSchema)

module.exports = Issue;