// Set Logger
let log4js = require('log4js');
const {isRunOnDocker} = require('../config/mongodb.json')
const setupLogPath = (Board) => {
    const logPath = isRunOnDocker? `/data/logs/${Board}`:`logs/${Board}`;
    // log4js Appender的設定
    log4js.configure({
        appenders:[
            {
                type: 'console',    //輸出為console
                category: 'console' //別名為console
            }, // console show
            {
                type: 'dateFile',                                     //輸出為file
                filename: `${logPath}/access`, //輸出檔案名
                alwaysIncludePattern: true,
                pattern: "-yyyy-MM-dd.log",
                daysToKeep: 30,                                     //每10最多存最新10個檔案 
                category: 'info'                                 //別名為console
            },
            {
                type: 'dateFile',
                filename: `${logPath}/error`,
                alwaysIncludePattern: true,
                pattern: "-yyyy-MM-dd.log",
                daysToKeep: 30,
                category: 'error'
            },
            {
                type: 'dateFile',
                filename: `${logPath}/output`,
                alwaysIncludePattern: true,
                pattern: "-yyyy-MM-dd.log",
                daysToKeep: 30,
                category: 'warn'
            }
        ],
        replaceConsole: true
    });
};
let logger = log4js.getLogger('info');
logger.setLevel('INFO');

let log = log4js.connectLogger(logger, {level: 'auto', format:':method :url'})
/**
 * findlogger
 * 
 * @param {*} name 
 */
const findlogger = (name)=>{
    let logger = log4js.getLogger(name);
    let logLevel = 'INFO';
    switch(name){
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
    log: log,
    logger: findlogger,
    error: findlogger('error'),
    info: findlogger('info'),
    warn: findlogger('warn'),
    console: findlogger('console'),
    setupLogPath: setupLogPath
}