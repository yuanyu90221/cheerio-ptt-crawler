const cluster = require('cluster');
const os = require('os');
const obersableList = require('../ptt-popular-board-list.json');
const {proccessCrawl} = require('../crawlerLogic');

// const testObj = {test: 1};
let processedSet = [];
let workerPool = [];
for (let i = 0; i < os.cpus().length/2; i++) {
  let new_worker_env = {};
  let currentList = obersableList.map(item=>item.english_name).filter((item, idx)=> idx%os.cpus().length=== i);
  processedSet.push(currentList);
}
if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length/2; i++) {
    let new_worker_env = {};
    new_worker_env["WORKER_NAME"] = `worker-${i}`;
    new_worker_env["WORKER_NUM"] = i;
    let new_worker = cluster.fork(new_worker_env); 
    new_worker.on('online', (msg)=>{
      new_worker.id = i;
      console.log(`worker with id: ${new_worker.id} is start`);
    });
  }
} else {
  console.log(`WORKER_NAME:`,process.env['WORKER_NAME']);
  console.log(`WORKER_NUM:`,process.env['WORKER_NUM']);
  console.log(`proccessedSet${process.env['WORKER_NUM']}`, processedSet[process.env['WORKER_NUM']]);
  proccessCrawl(processedSet[process.env['WORKER_NUM']]);
  // if (process.env['WORKER_NUM']==3) {
  //   process.send({cmd:'quit', data:'quit'});
  // } else {
  //   process.send({cmd: 'test', data: `${process.env['WORKER_NUM']} test`});
  // }
}