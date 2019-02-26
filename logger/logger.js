// Set Logger
let log4js = require('log4js')
let moment = require('moment')
// let outputTimeFormat = moment().format("YYYY-MM-DD")

const {isRunOnDocker} = require('../config/mongodb.json')
const logPath = isRunOnDocker? '/data/logs':'logs';
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
            // maxLogSize:  102400,                               //每1024 MB為一個檔案
            // backups: 30,
            daysToKeep: 30,                                     //每10最多存最新10個檔案 
            category: 'info'                                 //別名為console
        },
        {
            type: 'dateFile',
            filename: `${logPath}/error`,
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            // maxLogSize:  102400, // 
            daysToKeep: 30,
            category: 'error'
        },
        {
            type: 'dateFile',
            filename: `${logPath}/output`,
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            // maxLogSize:  102400, // 
            // backups: 30,
            daysToKeep: 30,
            category: 'warn'
        }
    ],
    replaceConsole: true
})

let logger = log4js.getLogger('info')
logger.setLevel('INFO')

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
    console: findlogger('console')
}