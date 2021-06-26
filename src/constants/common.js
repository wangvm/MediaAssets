const userType = {
  /** 管理 */
  0: 'admin',
  /** 创建任务 */
  1: 'task',
  /** 编目 */
  2: 'check',
  /** 审核 */
  3: 'video'
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

export {
  userType,
  projectStatus
}