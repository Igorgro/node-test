const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('hbs')

const Database = require('./lib/database.js')
const ApiHandler = require('./lib/api.js')
const logger = require('./lib/logger.js')

let app = null;
let server =null;
let db = null;
let api = null;

function init() {
    initWebServer();
    initDatabase();
    initApi()

    process.on('SIGTERM',onSigTerm);
    process.on('SIGINT',onSigTerm);
}

function initWebServer() {
    logger.log('Starting web server', logger.LogLevel.info)
    app = express()

    hbs.registerPartials(__dirname + '/views/partials')
    app.set('view engine', 'hbs')

    // handle static resources
    app.use('/public', express.static('public'))

    app.get('/', (req, res)=>{
        logger.log('Index requested', logger.LogLevel.info)
        res.render('index.hbs', { page_script: "/public/js/index.js" })
        // res.sendFile(__dirname + '/public/html/index.html')
    })

    // handle api post requests
    app.use(bodyParser.json())
    app.post('/api', (req, res)=>{
        api.handle(req, res)
    })


    server = app.listen(8080)
}

function initDatabase() {
    logger.log('Initializing databaze', logger.LogLevel.info)
    db = new Database()
}

function initApi() {
    api = new ApiHandler(db, logger)
}

function onSigTerm () {
    logger.log('SIGTERM recieved', logger.LogLevel.info)
    server.close()
    db.close()
}

init()
