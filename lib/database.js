const sqlite3 = require('sqlite3')

class Database {
    constructor() {
        this._db = new sqlite3.Database("databases/site.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
            if(err) {
                console.log(err);
            }
        });
        this._createTablesIfNeed();
    }

    close () {
        this._db.close();
    }

    get db() {
        return this._db
    }

    _createTablesIfNeed() {
        this._checkIfTableExists('users').then((result)=>{
            if(!result) {
                this._db.run(`CREATE TABLE users (username TEXT NOT NULL PRIMARY KEY,
                                            password TEXT NOT NULL,
                                            first_name TEXT NOT NULL,
                                            last_name TEXT NOT NULL,
                                            email TEXT NOT NULL)`);
            }
        })
    }

    async _checkIfTableExists (tableName) {
        return new Promise ((resolve, reject)=> {
            this._db.get('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?', [tableName], (err, row)=>{
                if (err) { reject(err) }
                else {
                    if (row) {
                        resolve (true);
                    }
                    else {
                        resolve (false);
                    }
                }
            })
        })
    }
}


module.exports = Database;

