const mongoose = require('mongoose');
const { Schema } = mongoose;
const { getConnection } = require('./db');
const conn = getConnection();
const moment = require('moment');
const pttArticleSchema = new Schema({
  _id: String,
  boardName: {
    type: String,
    default: ''
  },
  keywords: [String],
  postInfo: {
    author: {
      type: String,
      default: ''
    },
    board: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    time: {
      type: Number,
      default: moment().unix()
    }
  },
  pushInfo: {
    like: [
      {
        id: String,
        comment: String,
        ip: {
          type: String,
          default: ''
        },
        time: {
          type: String,
          default: ''
        }
      }
    ],
    dislike: [
      {
        id: String,
        comment: String,
        ip: {
          type: String,
          default: ''
        },
        time: {
          type: String,
          default: ''
        }
      }
    ],
    arrow: [
      {
        id: String,
        comment: String,
        ip: {
          type: String,
          default: ''
        },
        time: {
          type: String,
          default: ''
        }
      }
    ]
  },
  contentInfo: {
    text: {
      type: String,
      default: ''
    },
    article_link: [{
      type:String,
      default: ''
    }],
    image: [{
      type:String,
      default: ''
    }],
    link: [{
      type:String,
      default: ''
    }]
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const pttArticle = conn.model('pttArticle', pttArticleSchema, 'pttArticle');
module.exports.pttArticle = pttArticle;