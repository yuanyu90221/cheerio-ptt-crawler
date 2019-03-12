const {pttArticleDao} = require('../daos/pttArticleDao');
const getPostInfo = (_$) => {
  let obj = {
    author: 'unknown',
    board: 'unknown',
    title: 'unknown',
    time: undefined
  };
  let values = _$('.article-meta-value');
  if (!values) return obj;
  if (values[0]) obj.author = _$(values[0]).text();
  if (values[1]) obj.board = _$(values[1]).text();
  if (values[2]) obj.title = _$(values[2]).text();
  if (values[3]) obj.time = _$(values[3]).text();
  console.log(`time ${obj.time}`);
  return obj;
};
const getPushInfo = (_$) => {
  let obj = {
    like: [],
    dislike: [],
    arrow: []
  };
  _$('.push').each((index, push) => {
    // console.log(_$(push).children()[0]);
    //console.log(push.firstChild.innerText)
    if (!(_$(push).children()[0])) return;
    let tag = _$(_$(push).children()[0]).text()[0];
    if (tag === '推') tag = 'like';
    else if (tag === '噓') tag = 'dislike';
    else if (tag === '→') tag = 'arrow';
    else tag = 'unknown';

    let iptime;
    if (_$(push).children()[3])
    {
      iptime = /(.*)\s?(\d{2}\/\d{2}\s\d{2}\:\d{2})/.exec(
        _$(_$(push).children()[3]).text()
      );
    }
    obj[tag].push({
      id: push.children[1] ? _$(_$(push).children()[1]).text(): 'unknown',
      comment: _$(push).children()[2] ?_$(_$(push).children()[2]).text() : 'unknown',
      ip: iptime ? iptime[1] : ' ',
      time: iptime ? (iptime[2]) : ('01/01 00:00')
    });
  });
  // api get length convenience
  obj.likeCount = obj.like.length;
  obj.dislikeCount = obj.dislike.length;
  obj.arrowCount = obj.arrow.length;
  return obj;
};

const getContent = (_$) => {
  let article_link = '';
  let first_node  = _$('#main-content span.f2 a');
  let second_node = _$('#main-content a span.f2');
  let el_article_link = (first_node && first_node.length > 0)? first_node: second_node;
  if (el_article_link && el_article_link.length > 0) {
    article_link = _$(el_article_link[el_article_link.length-1]).text();
  }
  // console.log(article_link);
  let el = _$('#main-content'),
    child = el.children()[0],
    texts = [],
    links = [],
    images = [];
  // console.log(el.children()[0]);
  while (child) {
    if (child.tagName === 'a') {
      links.push(_$(child).text());
      if (/\.(jpg|png|gif)/.test(_$(child).text()))
        images.push(_$(child).text());
    }
    if (child.nodeType == 3) {
      texts.push(child.data);
    }
    child = child.next;
  }

  let text = texts.join('');   
  return {
    text: text,
    link: links,
    image: images,
    article_link: article_link
  };
};

/**
 * @description parseArticleLogic
 * 
 * @param {parser} cheerio
 * @param {object} axios
 * @param {Array} links 
 * @param {logger} orgLog
 * @param {logger} info
 * @param {logger} error
 */
const parseArticleLogic = async(cheerio, axios,links, orgLog, info, error) => {
  let articleInfo = [];
  for (let idx=0; idx < links.length; idx++) {
    let item = links[idx];
    let {link} = item;
    let words = link.split('.html')[0].split('/');
    let articleId = words[words.length-1];
    let articleUrl = `https://www.ptt.cc${link}`;
    orgLog.log(`articleId ${articleId}, articleUrl: ${articleUrl}`);
    info.info(`articleId ${articleId}, articleUrl: ${articleUrl}`)
    try {
      const articleResult = await axios.get(`${articleUrl}`, {headers: {
        'Cookie': 'over18=1'
      }});
      
      if (articleResult.status >= 400) {
        orgLog.log(`load page error`);
        error.error(`load page error`);
      } else {
        let articleHtml = articleResult.data;
        let _$ = cheerio.load(articleHtml);     
        let {author, board, title, time} = getPostInfo(_$);
        const postInfo = {author, board, title, time};
        let {like, dislike, arrow} = getPushInfo(_$);
        const pushInfo = {like, dislike, arrow};
        let {text, article_link, image, link} = getContent(_$);
        const contentInfo = {text, article_link, image, link};
        articleInfo.push({_id:articleId ,postInfo,pushInfo,contentInfo});
      }
    } catch (e) {
      let articleStatus = e.response.status;
      orgLog.log(`[load article error] requestArticle: ${articleUrl}, requestStatus:${articleStatus}, error:${e.toString()}`);
      error.error(`[load article error] requestArticle: ${articleUrl}, requestStatus:${articleStatus}, error:${e.toString()}`);
      if (articleStatus!==404) {
        throw e;
      } else {
        try {
          await pttArticleDao.upSertArticle({_id:articleId, isVisible:false});
        } catch(err){
          console.log(err.toString() + ` with ${articleId}`);
        }
        continue;
      } 
    }
  }
  orgLog.log(`[parseArticleLogic] articleInfo.length: ${articleInfo.length},links.length: ${links.length}`);
  info.info(`[parseArticleLogic] articleInfo.length: ${articleInfo.length},links.length: ${links.length}`);
  return articleInfo;
};

module.exports = {
  getPostInfo: getPostInfo,
  getPushInfo: getPushInfo,
  getContent: getContent,
  parseArticleLogic: parseArticleLogic
};