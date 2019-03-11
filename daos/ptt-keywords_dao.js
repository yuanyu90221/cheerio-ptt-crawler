const { PTTKeywords } = require('../models/ptt-keywors');

exports.findOne = (conditions) => {
  return new Promise((resolve, reject) => {
    PTTKeywords.findOne(conditions, (err, res) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(res);
      }
    }).lean();//parse doc to json
  });
};

exports.find = (conditions={}) => {
  return new Promise((resolve, reject) => {
    PTTKeywords.find(conditions, (err, res) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(res);
      }
    }).lean();//parse doc to json
  });
};

exports.updateOne = (conditions, doc, options) => {
  return new Promise((resolve, reject) => {
    PTTKeywords.updateOne(conditions, doc, options, (err, raw) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(raw);
      }
    });
  });
};