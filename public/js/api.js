
Api = {
    /**
     * Register user
     * @param {FormData} fd form, containing user information
     * @param {function} callback callback, called after response
     */
    registerUser: function(fd, callback) {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/api')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.addEventListener('load', ()=>{
            callback(xhr.response)
        })
        xhr.send(JSON.stringify({ f: 'register', args: [ formDataToObject(fd) ] }))
    }
}
