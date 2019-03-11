// const obersableList = require('./ptt-popular-board-list.json');
const {pttCrawler} = require('./index');
//console.log(obersableList);
const offset = 8;
const proccessCrawl = async(obersableList)=>{
  // console.log(Array.isArray(obersableList));
  for (let idx = 0; idx < obersableList.length - offset; idx+=offset) {
      let promiseList = [];
      let resultList = [];
      for (let idxOffSet = idx; idxOffSet < offset+idx; idxOffSet++){
        console.log(`start to crawl ${obersableList[idxOffSet]}`);
        promiseList.push(pttCrawler(obersableList[idxOffSet],['問卦','美女']));
      }
      try {
        resultList = await Promise.all(promiseList);
      } catch (e){
        console.log(e.toString());
      }
  }
};

module.exports = { proccessCrawl };