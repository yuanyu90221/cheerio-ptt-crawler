const getPrev = ($)=> {
  let prevLink = '';
  let result =$('.btn.wide');
  if(result.length > 0 ) {
    result.each((index, button)=> {
      if ($(button).text().includes('上頁')) prevLink = $(button).attr('href');
    });
  }
  return prevLink;
}

const getPageNumber = ($) => {
  let prev = getPrev($);
  if (prev === '') return 1;
  //console.log(prev);
  if (!/index(\d*)\.html/.test(prev)) return 'error';
  let prevPageNumber = /index(\d*)\.html/.exec(prev)[1];
  return Number(prevPageNumber) + 1;
}

const LinkParser = ($) => {
  let link = [];
  $('.title>a').each((index, a) => {
    if ($(a).text().includes('公告')) return;
    link.push({
      title: $(a).text(),
      link: $(a).attr('href')
    });
  });
  return link;
}

module.exports = {
   getPrev: getPrev,
   getPageNumber: getPageNumber,
   LinkParser: LinkParser
};