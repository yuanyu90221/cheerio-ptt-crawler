// Set Logger
let log4js = require('log4js');
const {isRunOnDocker} = require('../config/mongodb.json')
let appendersCurrent = [];
let BoardsList = [];
const setupLogPath = (Board) => {
    
    BoardsList.push(Board);
    // console.log(BoardsList);
    let appenders = [{
        type: 'console',    //輸出為console
        category: 'console' //別名為console
    }];
    BoardsList.forEach(BoardName => {
        const logPath = isRunOnDocker? `/data/logs/${BoardName}`:`logs/${BoardName}`;
        appenders.push({
            type: 'dateFile',                                     //輸出為file
            filename: `${logPath}/access`, //輸出檔案名
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            daysToKeep: 2,                                     //每10最多存最新10個檔案 
            category: `info${BoardName}`                                 //別名為console
        });
        appenders.push({
            type: 'dateFile',                                     //輸出為file
            filename: `${logPath}/output`, //輸出檔案名
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            daysToKeep: 2,                                     //每10最多存最新10個檔案 
            category: `warn${BoardName}`                                 //別名為console
        });
        appenders.push({
            type: 'dateFile',                                     //輸出為file
            filename: `${logPath}/error`, //輸出檔案名
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            daysToKeep: 2,                                     //每10最多存最新10個檔案 
            category: `error${Board}`                                 //別名為console
        });
    })
    log4js.clearAppenders();
    // log4js Appender的設定
    log4js.configure({
        appenders,
        replaceConsole: true
    });
};
const getNewLogger = (Name) => {
    let logger = log4js.getLogger(Name);
    logger.setLevel('INFO');

    let log = log4js.connectLogger(logger, {level: 'auto', format:':method :url'});
    return logger;
};
/**
 * findlogger
 * 
 * @param {*} name 
 */
const findlogger = (LogLV)=>(name)=>{
    let logger = log4js.getLogger(`${LogLV}${name}`);
    let logLevel = 'INFO';
    switch(LogLV){
        case 'info':
            logLevel = 'INFO';
            break;
        case 'error':
            logLevel = 'ERROR';
            break;
        case 'warn':
            logLevel = 'WARNING';
            break;
        case 'console':
            logLevel = 'CONSOLE';
            break;
    }
    logger.setLevel(logLevel);
    return logger;
}
module.exports = {
    error: findlogger('error'),
    info: findlogger('info'),
    warn: findlogger('warn'),
    console: findlogger('console'),
    setupLogPath: setupLogPath,
    getNewLogger: getNewLogger
}