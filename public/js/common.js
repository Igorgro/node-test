/* this script performs actions which are common to all pages:
*    1. Parse cookies
*    2. Detect wherether user authorized, using cookie 'token'
*    3. Depending on previous result creates login/register or profile buttons
*    4. Run pagespecific initialization (page() function)
*
*/

let navbarButtonsContainer = null;

function main() {
    // document.cookie = 'token=12h534abcd'
    // document.cookie = 'username=Igormahov'
    initVars()
    initEventListeners()
    let authorized = checkIfAuthorized()
    if (authorized) { /* showProfile() */ }
    else { showLoginButtons() }

    if(page) {
        page()
    }
}

function initVars() {
    navbarButtonsContainer = $('#navbar-buttons-container')[0]
}

function initEventListeners() {
    $('#reg-cancel-button')[0].addEventListener('click', sendRegisterForm)
    $('#reg-button')[0].addEventListener('click', ()=>{
        $('#reg-dialog').modal('hide')
    })

    $('#msg-ok-button')[0].addEventListener('click', ()=>{
        $('#msg-dialog').modal('hide')
    })
}

function checkIfAuthorized() {
    let cookie = cookieToObject()
    if ('token' in cookie){
        return true
    }
    return false
}

function cookieToObject() {
    let cookie = {}
    if (document.cookie) {
        document.cookie.split(';').forEach((item)=>{
            let arr = item.trim().split('=')
            cookie[arr[0]] = arr[1]
        })
    }
    return cookie
}

function showLoginButtons() {
    let loginLinkLi = document.createElement('li')
    loginLinkLi.className = 'nav-item'
    let loginLink = document.createElement('a')
    loginLink.className = 'nav-link  text-white'
    loginLink.id = 'login-link'
    loginLink.innerText = 'Login'
    loginLink.href = '#'
    loginLinkLi.appendChild(loginLink)

    let registerLinkLi = document.createElement('li')
    registerLinkLi.className = 'nav-item'
    let registerLink = document.createElement('a')
    registerLink.className = 'nav-link text-white'
    registerLink.id = 'register-link'
    registerLink.innerText = 'Register'
    registerLink.href = '#'
    registerLink.addEventListener('click', showRegistrationDailog)
    registerLinkLi.appendChild(registerLink)

    navbarButtonsContainer.appendChild(loginLinkLi)
    navbarButtonsContainer.appendChild(registerLinkLi)

}
function showRegistrationDailog() {
    $('#reg-dialog').modal()
}

function sendRegisterForm() {
    let fd = new FormData($('#reg-form')[0])
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/api')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.addEventListener('load', (e)=>{
        let resp = JSON.parse(xhr.response)
        $('#reg-dialog').modal('hide')
        if (resp.successful) {
            showMessageDialog('Registration successful', 'OK')
        }
        else {
            showMessageDialog('Registration failed', resp.msg)
        }
    })
    xhr.send(JSON.stringify({ f: 'register', args: [ formDataToObject(fd) ] }))
}

function formDataToObject(fd) {
    let obj = {}
    fd.forEach((value, key)=>{
        console.log(key)
        obj[key] = value
    })
    return obj
    // for (let item of fd.entries()) {
    //     console.log(item)
    // }
}

function showMessageDialog(title, message) {
    $('#msg-title')[0].innerText = title
    $('#msg-message')[0].innerText = message
    $('#msg-dialog').modal()
}


window.addEventListener('load', main)