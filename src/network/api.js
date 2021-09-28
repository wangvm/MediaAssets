import request from "./request"

const $api = {
    login: (id, password) => request('/login', { id, password }, 'POST'),//ok
    register: (userList) => request('/user/add', { userList }, 'POST'),//ok
    logout: () => request('/logout'),

    // 获取用户列表
    getUserList: () => request('/user/search'),//ok
    // 删除用户
    deleteUser: (id) => request('/user/delete', { id }, 'POST'),//ok
    // 修改用户名
    updateUsername: (id, username) => request('/user/update/username', { id, username }, 'POST'),//ok
    // 修改密码
    updateUserPassword: (id, oldPassword, newPassword) => request('/user/update/password', { id, oldPassword, newPassword }, 'POST'),//ok
    // 重置密码
    resetPassword:(id, newPassword) => request('/user/reset', {id, newPassword}, 'POST'),
    // 更新用户信息
    updateUser: (uid, password, role) => request('/user/update', { uid, password, role }, 'POST'),
    // 根据id获取用户
    getUserById: (uid) => request('/user/id', { uid }),
    // 根据用户名获取用户
    getUserByName: (username) => request('/user/name', { username }),
    // 获取用户项目列表
    getUserProjectList: (uid) => request('/user/projects', { uid }),

    //获取项目列表
    getProjectList: () => request('/project/search'),
    //删除项目
    deleteProject: (pid) => request('/project/delete', { pid }),
    //根据项目pid获取项目
    getProjectById: (pid) => request('/project/task'),

    // 添加反馈
    AddFeedback: (title, details) => request('/feedback', { title, details }, 'POST'),
    // 查询反馈
    QueryFeedback: () => request('/feedback'),
    // 完成反馈
    CompleteFeedback: (feedbackId) => request('/feedback/completed', { feedbackId }, 'POST'),
}
export default $api