/**
 * 根据传入的数组和过滤的关键字返回筛选后的数据
 * @param {*} data 数组
 * @param {*} keyword 关键字
 * @returns 过滤后的数组
 */
export const filterMenuData = (data, keyword) => {
  // 检查每个节点
  return data
    .map((item) => {
      // 创建节点的浅拷贝，避免直接修改原数据
      const newItem = { ...item };
      if (item.children) {
        // 递归过滤子节点
        newItem.children = filterMenuData(item.children, keyword);
      }
      // 保留当前节点的条件：name 匹配 或 子节点非空
      if (newItem.name.includes(keyword) || (newItem.children && newItem.children.length > 0)) {
        return newItem;
      }
      return null; // 不符合条件时过滤掉
    })
    .filter((item) => item !== null); // 过滤掉 null 的项
};
