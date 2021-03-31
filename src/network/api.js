import request from "./request"

const $api = {
    login: (username, password) => request('/login', {username, password}, 'POST'),
    register: (username, password) => request('/register', {username, password}, 'POST'),
    logout: () => request('/logout'),
    // 获取用户列表
    getUserList: () => request('/user/list'),
    // 删除用户
    deleteUser: (uid) => request('/user/delete', {uid}),
    // 更新用户信息
    updateUser: (uid, password, role) => request('/user/update', {uid, password, role}, 'POST'),
    // 根据id获取用户
    getUserById: (uid) => request('/user/id', {uid}),
    // 根据用户名获取用户
    getUserByName: (username) => request('/user/name', {username}),
    // 获取用户项目列表
    getUserProjectList: (uid) => request('/user/projects', {uid})
}
export default $api