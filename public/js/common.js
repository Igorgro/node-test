/* this script performs actions which are common to all pages:
*    1. Parse cookies
*    2. Detect wherether user authorized, using cookie 'token'
*    3. Depending on previous result creates login/register or profile buttons
*    4. Run page-specific initialization (page() function)
*
*/

let navbarButtonsContainer = null;


function main() {
    initVars()
    initEventListeners()
    let authorized = checkIfAuthorized()
    //TODO: show userpic if authorized
    if (authorized) { /* showProfile() */ }
    else { showLoginButtons() }

    if(page) {
        page()
    }
}

function initVars() {
    navbarButtonsContainer = $('#navbar-buttons-container').get(0)
}

function initEventListeners() {
    $('#reg-cancel-button').on('click', sendRegisterForm)
    $('#reg-button').on('click', ()=>{
        $('#reg-dialog').modal('hide')
    })

    $('#msg-ok-button').on('click', ()=>{
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

/**
 * Convert document.cookie into key-value object
 */
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

/**
 * Show 'Login' and 'Register' buttons
 */
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
    Api.registerUser(fd, (response)=>{
        let resp = JSON.parse(response)
        $('#reg-dialog').modal('hide')
        if (resp.successful) {
            showMessageDialog('Registration successful', 'OK')
        }
        else {
            showMessageDialog('Registration failed', resp.msg)
        }
    })
}

/**
 * Convert FormData into key-value object
 * @param {FormData} fd FormData to convert
 */
function formDataToObject(fd) {
    let obj = {}
    fd.forEach((value, key)=>{
        obj[key] = value
    })
    return obj
}

function showMessageDialog(title, message) {
    $('#msg-title')[0].innerText = title
    $('#msg-message')[0].innerText = message
    $('#msg-dialog').modal()
}


window.addEventListener('load', main)
