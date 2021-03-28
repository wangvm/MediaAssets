const LOGIN_TYPE = 'loginType'
const CURRENT_MENU = 'currentMenu'

// 判断登录状态
export function setLoginType(loginType) {
	localStorage.setItem(LOGIN_TYPE, loginType)
}

export function getLoginType() {
	return localStorage.getItem(LOGIN_TYPE)
}

export function removeLoginType() {
	localStorage.removeItem(LOGIN_TYPE)
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

//保存token
export function setUserToken(token) {
	localStorage.setItem('userToken', token)
}

export function getUserToken() {
	return localStorage.getItem('userToken')
}

export function removeUserToken() {
	localStorage.removeItem('userToken')
}
