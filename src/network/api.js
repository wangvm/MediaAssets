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
    resetPassword: (id, newPassword) => request('/user/reset', { id, newPassword }, 'POST'),//ok
    // 更改用户权限
    updateAuthority: (id, authority) => request('/user/update/authority', { id, authority }, 'POST'),//ok
    // 根据id获取用户
    getUserById: (uid) => request('/user/search', { uid }),//ok
    // 根据用户名获取用户
    getUserByName: (name) => request('/user/search', { name }),//ok
    // 根据用户权限获取用户
    getUserByAuthority: (authority) => request('/user/search', { authority }),//ok
    // 获取用户项目列表
    getUserProjectList: (uid) => request('/user/projects', { uid }),//ok

    //获取项目列表
    getProjectList: () => request('/project/search'),//ok
    // 创建项目
    createProject: (projectName) => request('/project/add/project', { projectName }, 'POST'),//ok
    //删除项目
    deleteProject: (projectName) => request('/project/delete', { projectName }, 'POST'),//ok
    // 更改项目
    updateProject: (projectName, leaderId, category, status) => request('/project/update', { projectName, leaderId, category, status }, 'POST'),
    //根据项目名获取项目
    getProjectByName: (name) => request('/project/search', { name }),//ok
    //根据项目类别获取项目
    getProjectByCategory: (category) => request('/project/search', { category }),//ok
    //根据项目状态获取项目
    getProjectByStatus: (status) => request('/project/search', { status }),//ok
    //根据起始时间获取项目
    getProjectByStart: (start) => request('/project/search', { start }),//ok
    //根据结束时间获取项目
    getProjectByEnd: (end) => request('/project/search', { end }),//ok
    //根据组长账号获取项目
    getProjectByLeader: (leader) => request('/project/search', { leader }),//ok

    // 批量添加任务
    addTask: (taskList) => request('/task/add', { taskList }, 'POST'),
    // 上传视频
    fileUpload: (file, taskName) => request('/file/upload', { file, taskName }, 'POST'),
    // 删除任务
    deleteTask: (taskName) => request('/task/delete', { taskName }),
    // 更改任务
    updateTask: (taskName, status, cataloger, auditor, videoId, catalogId) => request('/task/update', { taskName, status, cataloger, auditor, videoId, catalogId }, 'POST'),
    // 任务查询
    getTaskAllList: () => request('/task/search'),
    // 根据任务名查询
    getTaskByName: (name) => request('/task/search', { name }),
    // 根据任务名查询
    getTaskByProject: (project) => request('/task/search', { project }),
    // 根据任务名查询
    getTaskByStatus: (status) => request('/task/search', { status }),
    // 根据任务名查询
    getTaskByCatalog: (cataloger) => request('/task/search', { cataloger }),
    // 根据任务名查询
    getTaskByAuditor: (auditor) => request('/task/search', { auditor }),

    // 添加反馈
    AddFeedback: (title, details) => request('/feedback', { title, details }, 'POST'),
    // 查询反馈
    QueryFeedback: (status) => request('/feedback', { status }),
    // 完成反馈
    CompleteFeedback: (feedbackId) => request('/feedback/completed', { feedbackId }, 'POST'),

    // 新建编目条目
    setCatalog: (catalogList) => request('/catalog/add', catalogList, 'POST'),
    // 更新编目内容
    updateCatalog: (updateList) => request('/catalog/update', {updateList}, 'POST'),
    // 搜索编目内容
    getCatalog: (key, value) => request('/catalog/search', { key, value }),
    // 关键帧截取接口
    getscreenshotList: (cutTime, taskName) => request('/catalog/cut', { cutTime, taskName }),

}
export default $api