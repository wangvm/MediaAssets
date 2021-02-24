const IF_LOGIN = 'ifLogin'
const CURRENT_MENU = 'currentMenu'

// 判断登录状态
export function setIfLogin(bool) {
    localStorage.setItem(IF_LOGIN, bool)
}

export function getIfLogin() {
    return localStorage.getItem(IF_LOGIN)
}

export function removeIfLogin() {
    N
    localStorage.removeItem(IF_LOGIN)
}

// 保存当前菜单值
export function setCurrentMenu(currentMenu) {
    localStorage.setItem(CURRENT_MENU, currentMenu)
}

export function getCurrentMenu() {
    return localStorage.getItem(CURRENT_MENU)
}

export function removeCurrentMenu() {
    localStorage.removeItem(CURRENT_MENU)
}