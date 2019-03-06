const cluster = require('cluster');
const os = require('os');
const obersableList = require('../ptt-popular-board-list.json');
const {proccessCrawl} = require('../crawlerLogic');
if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length/4; i++) {
    let new_worker_env = {};
    let currentList = obersableList.map(item=>item.english_name).filter((item, idx)=> idx%os.cpus().length=== i);
    new_worker_env["BOARD_LIST"] = currentList;
    new_worker_env["WORKER_NAME"] = `worker${i}`;
    let new_worker = cluster.fork(new_worker_env);
  }
} else {
  console.log(`WORKER_NAME:`,process.env['WORKER_NAME']);
  console.log("BOARD_LIST,",process.env['BOARD_LIST']);

  proccessCrawl(process.env['BOARD_LIST'].split(","));
}