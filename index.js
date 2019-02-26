const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const { getPrev, getPageNumber, LinkParser }= require('./lib/page_parser');
const { getPostInfo, getPushInfo, getContent }= require('./lib/article_parser');
const logger = require('./logger/logger');
const orgLog = require('console');
const {info, warn} =logger;
// set up incoming params
let Board = 'Gossiping', nowPage = 0, writeToFile = false;
if (process.argv[2]) Board = process.argv[2];
if (process.argv[3]) {
  if (process.argv[3]==='true'||process.argv[3]==='false') writeToFile = process.argv[3];
  else nowPage = process.argv[3];
}
console.log(`Board ${Board} / Page ${nowPage} `)
info.info(`Board ${Board} / Page ${nowPage} `);
/**
 * @description parsePageLogic
 * 
 * @param {html} html 
 */
const parsePageLogic = async(html) => {
  let $ = cheerio.load(html);
  let prevLink = '';
  let links = LinkParser($);
  prevLink = getPrev($);
  let pageNum = getPageNumber($);
  return {
    links: links,
    prevLink: prevLink,
    pageNum: pageNum
  };
};
/**
 * @description parseArticleLogic
 * 
 * @param {Array} links 
 */
const parseArticleLogic = async(links) => {
  let articleInfo = [];
  for (let idx=0; idx < links.length; idx++) {
    let item = links[idx];
    let {link} = item;
    let articleUrl = `https://www.ptt.cc${link}`;
    orgLog.log(`articleUrl: ${articleUrl}`);
    info.info(`articleUrl: ${articleUrl}`)
    try {
      const articleResult = await axios.get(`${articleUrl}`, {headers: {
        'Cookie': 'over18=1'
      }});
      
      if (articleResult.status >= 400) {
        orgLog.log(`load page error`);
        info.error(`load page error`);
      } else {
        let articleHtml = articleResult.data;
        let _$ = cheerio.load(articleHtml);     
        let {author, board, title, time} = getPostInfo(_$);
        const postInfo = {author, board, title, time};
        let {like, dislike, arrow} = getPushInfo(_$);
        const pushInfo = {like, dislike, arrow};
        let {text, article_link, image, link} = getContent(_$);
        const contentInfo = {text, article_link, image, link};
        articleInfo.push({postInfo,pushInfo, contentInfo});
      }
    } catch (e) {
      orgLog.log(`[load article error] :${e.toString()}`);
      info.error(`[load article error] :${e.toString()}`);
      throw e;
    }
  }
  return articleInfo;
};
/**
 * @description do the crawl logic
 */
(async()=>{
  while(true) {
    orgLog.log(`start crawl ${Board} new page`);
    info.info(`start crawl ${Board} new page`);
    orgLog.time('startParse');
    try {
      let result = await axios.get(`https://www.ptt.cc/bbs/${Board}/index${nowPage}.html`, {headers: {
          'Cookie': 'over18=1'
      }});
      if (result.status>=400) {
        orgLog.error(`https://www.ptt.cc/bbs/${Board}/index${nowPage}.html not exist`);
        info.error(`https://www.ptt.cc/bbs/${Board}/index${nowPage}.html not exist`);
      } else {
        let html = result.data;
        // parse Page logic
        let {prevLink, pageNum, links} = await parsePageLogic(html);
        orgLog.log(`prevLink`, prevLink);
        warn.info(`prevLink`, prevLink);
        orgLog.log(`pageNum`, pageNum);
        warn.info(`pageNum`, pageNum);
        orgLog.log(`links`, links);
        warn.info(`links`, links);
        
        nowPage = pageNum;
        // load links logic
        let articleInfo = [];
        articleInfo = await parseArticleLogic(links);
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
        if (nowPage===0) break;
      }
    } catch (e) {
      orgLog.error(`[error] load page error: ${e.toString()}`);
      info.error(`[error] load page error: ${e.toString()}`);
    }
    orgLog.timeEnd('startParse');
  }
})();