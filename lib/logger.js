// For log format visit https://github.com/Igorgro/log-format

const LogLevel = {
    info: 1,
    warn: 2,
    error: 3
}

module.exports.LogLevel = LogLevel

module.exports.log = function log(message, level = LogLevel.info, thread = "MAIN") {
    let levelStr = null;
    switch (level) {
        case LogLevel.info:
            levelStr = 'INFO'
            break
        case LogLevel.warn:
            levelStr = 'WARN'
            break
        case LogLevel.error:
            levelStr = 'ERROR'
            break
        default:
            levelStr = 'ERROR'
    }
    console.log ('[%s][%s][%s] %s', getCurrenDatetime(), levelStr, thread, message)
}


function getCurrenDatetime() {
    let dt = new Date(Date.now())
    let date = '' + dt.getFullYear() + '-' + ('0' + dt.getMonth()).slice(-2) + '-' +
                + ('0' + dt.getDate()).slice(-2) + ' ' + ('0' + dt.getHours()).slice(-2) + ':'
                + ('0' + dt.getMinutes()).slice(-2) + ':' + ('0' + dt.getSeconds()).slice(-2)
    return date
}

