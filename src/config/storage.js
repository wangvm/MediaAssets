const IFLOGIN = 'ifLogin'

export function setIfLogin(bool) {
    localStorage.setItem(IFLOGIN, bool)
}

export function getIfLogin() {
    return localStorage.getItem(IFLOGIN)
}

export function removeIfLogin() {
    localStorage.removeItem(IFLOGIN)
}