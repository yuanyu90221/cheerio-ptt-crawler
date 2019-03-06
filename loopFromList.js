const obersableList = require('./ptt-popular-board-list.json');
const {pttCrawler} = require('./index');
//console.log(obersableList);
const offset = 8;
(async()=>{
  console.log('test');
  for (let idx = 0; idx < obersableList.length - offset; idx+=offset) {
      let promiseList = [];
      let resultList = [];
      for (let idxOffSet = idx; idxOffSet < offset+idx; idxOffSet++){
        console.log(`test21321`);
        console.log(obersableList[idxOffSet]);
        promiseList.push(pttCrawler(obersableList[idxOffSet].english_name));
      }
      try {
        resultList = await Promise.all(promiseList);
      } catch (e){
        console.log(e.toString());
      }
  }
})();