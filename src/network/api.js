import request from "./request"

const $api = {
    login: (id, password) => request('/login', { id, password }, 'POST'),
    register: (userList) => request('/user/add', { userList }, 'POST'),
    logout: () => request('/logout'),

    // 获取用户列表
    getUserList: () => request('/user/list'),
    // 删除用户
    deleteUser: (uid) => request('/user/delete', { uid }, 'POST'),
    // 更新用户信息
    updateUser: (uid, password, role) => request('/user/update', { uid, password, role }, 'POST'),
    // 根据id获取用户
    getUserById: (uid) => request('/user/id', { uid }),
    // 根据用户名获取用户
    getUserByName: (username) => request('/user/name', { username }),
    // 获取用户项目列表
    getUserProjectList: (uid) => request('/user/projects', { uid }),

    //获取项目列表
    getProjectList: () => request('/project/list'),
    //删除项目
    deleteProject: (pid) => request('/project/delete', { pid }),
    //根据项目pid获取项目
    getProjectById: (pid) => request('/project/task')

}
export default $api