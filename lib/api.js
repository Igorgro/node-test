
class ApiHandler {
    constructor(db, logger) {
        this._db = db
        this._logger = logger
    }

    async handle(req, res) {
        return new Promise((resolve, reject)=>{
            switch(req.body.f) {
                case 'register':
                    this.registerUser(req.body.args[0]).then((result)=>{
                        this.sendObjectResponse(result, res)
                    })
                    break
            }
        })
    }

    // sends object as json
    sendObjectResponse(obj, res) {
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(obj))
    }

    async registerUser(user) {
        return new Promise((resolve, reject) =>{
            // check if user already registered

            this._db.db.get('SELECT username FROM users WHERE (username = ?) OR (email = ?)',
                            user['username'], user['email'], (err, row)=>{
                                if (row) {
                                    resolve({successful: false, msg: "User already registered"})
                                }
                                else {
                                    this._db.db.run('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                                            user['username'],
                                            user['password'],
                                            user['first-name'],
                                            user['last-name'],
                                            user['email'])
                                    resolve({successful: true, msg:''})
                                }
                            })
        })
    }
}


module.exports = ApiHandler
