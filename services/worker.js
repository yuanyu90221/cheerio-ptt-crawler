const cluster = require('cluster');
const os = require('os');
const obersableList = require('../ptt-popular-board-list.json');
const {proccessCrawl} = require('../crawlerLogic');
const creaeteNewWorker = (i, cluster) => {
  let new_worker_env = {};
  new_worker_env["WORKER_NAME"] = `worker-${i}`;
  new_worker_env["WORKER_NUM"] = i;
  let new_worker = cluster.fork(new_worker_env); 
  new_worker.on('online', (msg)=>{
    new_worker.id = i;
    console.log(`worker with id: ${new_worker.id} is start`);
  });
  new_worker.on('error', (err)=> {
    console.log(`worker with id: ${new_worker.id} occurs error: ${err.toString()}`);
    new_worker.destroy();
  });
  return new_worker;
};
// const testObj = {test: 1};
let processedSet = [];
let workerPool = [];
for (let i = 0; i < os.cpus().length/2; i++) {
  let currentList = obersableList.map(item=>item.english_name).filter((item, idx)=> idx%os.cpus().length=== i);
  processedSet.push(currentList);
}
if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length/2; i++) {
    let new_worker = creaeteNewWorker(i, cluster);   
    new_worker.on('exit', (code, signal)=>{
      console.log(`worker with id: ${new_worker.id} exit with code: ${code}, signal: ${signal} `);
      creaeteNewWorker(new_worker.id, cluster);
    });
  }
} else {
  console.log(`WORKER_NAME:`,process.env['WORKER_NAME']);
  console.log(`WORKER_NUM:`,process.env['WORKER_NUM']);
  console.log(`proccessedSet${process.env['WORKER_NUM']}`, processedSet[process.env['WORKER_NUM']]);
  proccessCrawl(processedSet[process.env['WORKER_NUM']]);
}

