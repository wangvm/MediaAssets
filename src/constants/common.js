const userType = {
  /** 管理 */
  0: {
    key: 0,
    label: '管理员',
  },
  /** 创建任务 */
  1: {
    key: 1,
    label: '创建任务',
  },
  /** 编目 */
  2: {
    key: 2,
    label: '编目',
  },
  /** 审核 */
  3: {
    key: 3,
    label: '审核',
  },
  /** 未设置权限 */
  4: {
    key: 4,
    label: '未设置权限'
  }
}

const projectStatus = {
  /** 删除状态 */
  '-1': {
    value: "-1",
    label: "已删除",
  },
  /** 新创建状态 */
  '1': {
    value: "1",
    label: "新创建",
  },
  /** 编目状态 */
  '2': {
    value: "2",
    label: "编辑中",
  },
  /** 完成状态 */
  '3': {
    value: "3",
    label: "已完成",
  },
}

const taskStatus = {
  /** 删除状态 */
  '-1': {
    value: "-1",
    label: "终止",
  },
  /** 新创建状态 */
  '1': {
    value: "1",
    label: "新创建",
  },
  /** 编目状态 */
  '2': {
    value: "2",
    label: "编辑中",
  },
  /** 完成状态 */
  '3': {
    value: "3",
    label: "已完成",
  },
  /** 审核状态 */
  '4': {
    value: "4",
    label: "审核中",
  },
}

const feedbackStatus = {
  /** 完成状态 */
  'completed': {
    value: "completed",
    label: "完成",
  },
  /** 新创建状态 */
  'all': {
    value: "all",
    label: "新创建",
  },
  /** 处理状态 */
  'pending': {
    value: "pending",
    label: "处理中",
  },
}

export {
  userType,
  projectStatus,
  taskStatus,
  feedbackStatus
}