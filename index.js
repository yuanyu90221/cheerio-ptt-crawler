const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const { parsePageLogic } = require('./lib/page_parser');
const { parseArticleLogic } = require('./lib/article_parser');
const { pttArticleDao } = require('./daos/pttArticleDao');
const orgLog = require('console');
const { setupLogPath ,info, warn, error} = require('./logger/logger');
// set up incoming params
let Board = 'Gossiping', nowPage = 0, writeToFile = false;
/**
 * @description initSetup
 */
const initSetup = ()=> {
  if (process.argv[2]) Board = process.argv[2];
  if (process.argv[3]) {
    switch (process.argv[3]) {
      case 'true':
      case 'false':
        writeToFile = process.argv[3];
        break;
      default:
        nowPage = process.argv[3];
    }
  }
  // setupLogPath(Board);
};
// do init setup
// initSetup();
/**
 * @description do the crawl logic
 */
const pttCrawler = async(Board='Gossiping',keywords=[], nowPage=0, writeToFile='false')=>{
    let totalPage = 0;
    setupLogPath(Board);
    let infoLogger = info(Board), errorLogger = error(Board), warnLogger = warn(Board);
    while(true) {
      orgLog.log(`start crawl ${Board} new page, nowPage: ${nowPage}`);
      infoLogger.info(`start crawl ${Board} new page, nowPage: ${nowPage}`);
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
          let insertResults = null;
          // parse Page logic
          let {prevLink, pageNum, links} = await parsePageLogic(cheerio, html);
          orgLog.log(`prevLink`, prevLink);
          warnLogger.info(`prevLink`, prevLink);
          orgLog.log(`pageNum`, pageNum);
          warnLogger.info(`pageNum`, pageNum);
          orgLog.log(`links`, links);
          warnLogger.info(`links`, links);
          if(totalPage===0){
            totalPage = pageNum;
          }  
          nowPage = pageNum;
          // load links logic
          let articleInfo = [];
          articleInfo = await parseArticleLogic(cheerio, axios, links, orgLog, infoLogger, errorLogger);
          // match keywords
          let articleDataArray = [];
          for(let artIdx =0; artIdx < articleInfo.length; artIdx++){
            let article = articleInfo[artIdx];
            article.boardName = article.postInfo.board;
            article.postInfo.time = new Date(article.postInfo.time);
            let keywordsArr = [];
            for(let keyIdx=0;keyIdx<keywords.length; keyIdx++){
              let keyword = keywords[keyIdx];
              let {title} = article.postInfo;
              if (title.includes(keyword)){
                keywordsArr.push(keyword);
                await pttArticleDao.deleteTarget(article._id);
              }
            }
            article.keywords = keywordsArr;
            if (keywordsArr.length > 0) {
              articleDataArray.push(article);
            }
          }
          if (articleDataArray.length > 0) {
            try {
              insertResults = await pttArticleDao.insertMany(articleDataArray);
              info.info(`[pttArticleDao] insert Article length :${articleDataArray.length}`);
              orgLog.log(`[pttArticleDao] insert Article length :${articleDataArray.length}`);
            } catch (e) {
              orgLog.error(`[pttArticleDao] insert Article error with data:`, articleDataArray);
              errorLogger.error(`[pttArticleDao] insert Article error with data:`, articleDataArray);
              orgLog.error(`[pttArticleDao] insert error with message: ${e.toString()}`);
              errorLogger.error(`[pttArticleDao] insert error with message: ${e.toString()}`);
            }
          }
          // write file process
          if (writeToFile==='true') {
            if (!fs.existsSync('./data')) fs.mkdirSync('./data');
            if (!fs.existsSync(`./data/${Board}`)) fs.mkdirSync(`./data/${Board}`);
            fs.writeFileSync(
              `./data/${Board}/${Board}_${nowPage}.json`,
              JSON.stringify(articleInfo),
              { flag: 'w' }
            );  
            orgLog.log(`Saved as data/${Board}/${Board}_${nowPage}.json`);
            infoLogger.info(`Saved as data/${Board}/${Board}_${nowPage}.json`);
          }
          orgLog.log(`proccessed index ${Board}/${Board}_${nowPage}.json`);
          infoLogger.info(`proccessed index ${Board}/${Board}_${nowPage}.json`);
          nowPage -= 1;
          orgLog.log(`totalPage: ${totalPage}, nowPage: ${nowPage}, proccessed percentage: ${(100 - ((nowPage/totalPage)*100)).toFixed(2)}% for ${Board}`);
          infoLogger.info(`totalPage: ${totalPage}, nowPage: ${nowPage}, proccessed percentage: ${(100 - ((nowPage/totalPage)*100)).toFixed(2)}% for ${Board}`);
          if (nowPage===0) break;
        }
      } catch (e) {
        let status = e.response.status;
        let errHeaders = e.response.headers;
        orgLog.error(`[error] request url: ${requestURL}, load page error status: ${status}`);
        errorLogger.error(`[error] request url: ${requestURL}, load page error status: ${status}`); 
        orgLog.error(`[error] request url: ${requestURL}, load page error headers:`, errHeaders);
        errorLogger.error(`[error] request url: ${requestURL}, load page error headers:`, errHeaders) 
        orgLog.error(`[error] request url: ${requestURL}, load page error: ${e.toString()}`);
        errorLogger.error(`[error] request url: ${requestURL}, load page error: ${e.toString()}`);
        nowPage -=1;
      }
      orgLog.timeEnd('startParse');
    }
};

module.exports = {
  pttCrawler: pttCrawler
};