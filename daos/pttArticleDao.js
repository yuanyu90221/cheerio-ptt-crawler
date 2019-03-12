const {pttArticle} = require('../models/pttArticle');
const deleteTarget = async(criteria)=>{
  return new Promise((resolve, reject)=>{
    pttArticle.deleteMany({_id: criteria._id}, (err, docs)=>{
      if(err) {
        reject(err);
      }
      console.log(`[pttArticleDao] delete docs:`, docs);
      resolve(docs); 
    });
  });
};
const pttArticleDao = {
  upSertArticle: async (article)=>{
    let options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
    return new Promise((resolve, reject)=>{
      pttArticle.findOneAndUpdate({_id: article._id}, article, options, (err, result)=>{
        if(err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
  insertMany: async (arr)=>{
    return pttArticle.insertMany(arr, (err, docs)=>{
      if (err) {
        throw err;
      }
      console.log(`[pttArticleDao] write docs:`, docs);
      return docs;
    });
  },
  deleteTarget: deleteTarget,
  findAll: async (criteria, skip, limit) => {
    criteria = criteria? criteria: {};
    skip = skip? Number(skip):0;
    limit = limit? Number(limit): 1000;
    let queryCriterias = [];
    for(let key in criteria) {
      console.log(`${key}: ${criteria[key]}`);
      let reg = new RegExp(criteria[key],'i');
      queryCriterias.push({[`${key}`]:{$regex: reg}});
    }
    if (queryCriterias.length > 0) {
      criteria = {"$or": queryCriterias};
    }
    return new Promise((resolve, reject)=>{
      pttArticle.find(criteria, (err, docs)=>{
        if (err) {
          reject(err);
        }
        resolve(docs);
      }).skip(skip).limit(limit).sort({timestamps: -1});
    });
  }
}

module.exports = {pttArticleDao};