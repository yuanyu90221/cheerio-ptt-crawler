const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const { parsePageLogic } = require('./lib/page_parser');
const { parseArticleLogic } = require('./lib/article_parser');
const logger = require('./logger/logger');
const orgLog = require('console');
const { setupLogPath ,info, warn, error} =logger;
// set up incoming params
let Board = 'Gossiping', nowPage = 0, writeToFile = false;
if (process.argv[2]) Board = process.argv[2];
if (process.argv[3]) {
  if (process.argv[3]==='true'||process.argv[3]==='false') writeToFile = process.argv[3];
  else nowPage = process.argv[3];
}
setupLogPath(Board);
console.log(`Board ${Board} / Page ${nowPage} `)
info.info(`Board ${Board} / Page ${nowPage} `);
/**
 * @description do the crawl logic
 */
(async()=>{
  do {
    let totalPage = 0;
    while(true) {
      orgLog.log(`start crawl ${Board} new page, nowPage: ${nowPage}`);
      info.info(`start crawl ${Board} new page, nowPage: ${nowPage}`);
      orgLog.time('startParse');
      let requestURL="";
      try {
        requestURL = `https://www.ptt.cc/bbs/${Board}/index${nowPage}.html`;
        let result = await axios.get(requestURL, {headers: {
            'Cookie': 'over18=1'
        }});
        if (result.status>=400) {
          orgLog.error(`${requestURL} not exist`);
          error.error(`${requestURL} not exist`);
        } else {
          let html = result.data;
          // parse Page logic
          let {prevLink, pageNum, links} = await parsePageLogic(cheerio, html);
          orgLog.log(`prevLink`, prevLink);
          warn.info(`prevLink`, prevLink);
          orgLog.log(`pageNum`, pageNum);
          warn.info(`pageNum`, pageNum);
          orgLog.log(`links`, links);
          warn.info(`links`, links);
          if(totalPage===0){
            totalPage = pageNum;
          }  
          nowPage = pageNum;
          // load links logic
          let articleInfo = [];
          articleInfo = await parseArticleLogic(cheerio, axios, links, orgLog, info, error);
          if (writeToFile==='true') {
            if (!fs.existsSync('./data')) fs.mkdirSync('./data');
            if (!fs.existsSync(`./data/${Board}`)) fs.mkdirSync(`./data/${Board}`);
            fs.writeFileSync(
              `./data/${Board}/${Board}_${nowPage}.json`,
              JSON.stringify(articleInfo),
              { flag: 'w' }
            );  
            orgLog.log(`Saved as data/${Board}/${Board}_${nowPage}.json`);
            info.info(`Saved as data/${Board}/${Board}_${nowPage}.json`);
          }
          orgLog.log(`proccessed index ${Board}/${Board}_${nowPage}.json`);
          info.info(`proccessed index ${Board}/${Board}_${nowPage}.json`);
          nowPage -= 1;
          orgLog.log(`totalPage: ${totalPage}, nowPage: ${nowPage}, proccessed percentage: ${(100 - ((nowPage/totalPage)*100)).toFixed(2)}% for ${Board}`);
          info.info(`totalPage: ${totalPage}, nowPage: ${nowPage}, proccessed percentage: ${(100 - ((nowPage/totalPage)*100)).toFixed(2)}% for ${Board}`);
          if (nowPage===0) break;
        }
      } catch (e) {
        let status = e.response.status;
        let errHeaders = e.response.headers;
        orgLog.error(`[error] request url: ${requestURL}, load page error status: ${status}`);
        error.error(`[error] request url: ${requestURL}, load page error status: ${status}`); 
        orgLog.error(`[error] request url: ${requestURL}, load page error headers:`, errHeaders);
        error.error(`[error] request url: ${requestURL}, load page error headers:`, errHeaders) 
        orgLog.error(`[error] request url: ${requestURL}, load page error: ${e.toString()}`);
        error.error(`[error] request url: ${requestURL}, load page error: ${e.toString()}`);
        nowPage -=1;
      }
      orgLog.timeEnd('startParse');
    }
  } while(nowPage===0);
})();