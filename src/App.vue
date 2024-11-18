<script setup>
import { ref, reactive, nextTick } from 'vue'
import camera from './mock/data.js'
import DhPlayer from './components/DhPlayer/index.vue'
import MenuItem from './components/MenuItem.vue'
import { filterMenuData } from './utils/index.js'
import { Sunny, Moon } from '@element-plus/icons-vue'

const dh = ref(null)
// 摄像列表
const cameraList = ref(camera)

// 	默认打开的 sub-menu 的 index 的数组
const openedsList = ['0', '202']

// 参数表单字段
const argumentForm = reactive({
  mode: 0,
  videoRecording: 2,
  date: ''
})
// 表单
const ruleFormRef = ref(null)
// 
const rules = reactive({
  date: [
    {
      type: 'date',
      required: true,
      message: '请选择日期',
      trigger: 'change',
    },
  ],
})

const modeOptions = [
  {
    value: 0,
    label: '实时预览',
  },
  {
    value: 3,
    label: '录像回放',
  },
  {
    value: 7,
    label: '录像回放（倒放）',
  },
]
const videoRecordingOptions = [
  {
    value: 2,
    label: '设备录像（存储在设备上的）',
  },
  {
    value: 3,
    label: '中心录像（存储在服务器上的）',
  },
]
const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

// 禁用大于今天的日期
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

// 播放模式值改变
const handlePlayMode = (e) => {
  // 重新初始化插件，以更改播放模式
  if (dh.value) {
    dh.value.reinitialize(e)
  }
}

// 获取选中窗口索引
const snumChange = (e) => {
  console.log(e);
}

// let tabIndex = 2
// const editableTabsValue = ref('2')
// const editableTabs = ref([
//   {
//     title: 'Tab 1',
//     name: '1',
//     content: 'Tab 1 content',
//   },
//   {
//     title: 'Tab 2',
//     name: '2',
//     content: 'Tab 2 content',
//   },
// ])
// const handleTabsEdit = (
//   targetName,
//   action
// ) => {
//   if (action === 'add') {
//     const newTabName = `${++tabIndex}`
//     dialogFormVisible.value = true
//     // editableTabs.value.push({
//     //   title: 'New Tab',
//     //   name: newTabName,
//     //   content: 'New Tab content',
//     // })
//     editableTabsValue.value = newTabName
//   } else if (action === 'remove') {
//     const tabs = editableTabs.value
//     let activeName = editableTabsValue.value
//     if (activeName === targetName) {
//       tabs.forEach((tab, index) => {
//         if (tab.name === targetName) {
//           const nextTab = tabs[index + 1] || tabs[index - 1]
//           if (nextTab) {
//             activeName = nextTab.name
//           }
//         }
//       })
//     }

//     editableTabsValue.value = activeName
//     editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
//   }
// }

// const dialogFormVisible = ref(false)
// const form = reactive({
//   name: '',
//   region: '',
//   date1: '',
//   date2: '',
//   delivery: false,
//   type: [],
//   resource: '',
//   desc: '',
// })

// 选中标签
const tagActive = ref(0)
const inputValue = ref('')

// 动态标签
const dynamicTags = ref(
  [{
    name: '实时预览',
    closable: false
  }]
)
const inputVisible = ref(false)
const InputRef = ref(null)

// 标签关闭
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  handleTagActive()
}

// 选中标签切换
const handleTagActive = () => {
  tagActive.value = dynamicTags.value.length - 1
}

// 显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

// 键盘回车及失去焦点，新增事件
const handleInputConfirm = () => {
  // 添加数据
  if (inputValue.value) {
    dynamicTags.value.push({
      name: inputValue.value,
      closable: true
    })
    handleTagActive()
  }
  // 隐藏输入框
  inputVisible.value = false
  inputValue.value = ''
}

// 设置选中标签
const handleTag = (index) => {
  tagActive.value = index
}

const handleMenuItem = (item) => {
  console.log("Clicked item:", item);
  if (dh.value) {
    // 模式判断
    if (argumentForm.mode === 0) {
      dh.value.startReal(item.channelCode, item.name)
    } else {
      ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
          dh.value.startPlayback(item.channelCode, camera[+e.index].name, argumentForm.date, argumentForm.videoRecording)
        }
      })
    }
  }
};
const localTopic = window.localStorage.getItem('topic')
// 模式切换
const topic = ref(localTopic ? +localTopic ? true : false : true)
const handleTopic = (e) => {
  window.localStorage.setItem('topic', e ? 1 : 0)
}

// 搜索处理
const searchVal = ref("")
const handleSearch = (val) => {
  cameraList.value = filterMenuData(camera, val)
}

</script>

<template>
  <div class="dhBox" :class="[topic ? 'dark' : '']">
    <el-container class="layout-container-demo"
      style="position: relative; left: 0; top: 0; height: 100%; background: #303133;">
      <el-header style=" font-size: 12px;">
        <div class="toolbar">
          <div style="width: 280px;">
            <h2>大华视频监控平台</h2>
          </div>
          <div style="flex: 1; display: flex; justify-content: space-between;">
            <el-form ref="ruleFormRef" :model="argumentForm" :rules="rules" label-width="auto" :inline="true">
              <el-form-item label="播放模式" prop="mode">
                <el-select v-model="argumentForm.mode" placeholder="Select" size="small" style="width: 200px"
                  @change="handlePlayMode">
                  <el-option v-for="item in modeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <template v-if="argumentForm.mode !== 0">
                <el-form-item label="录像模式" prop="videoRecording">
                  <el-select v-model="argumentForm.videoRecording" placeholder="Select" size="small"
                    style="width: 200px;">
                    <el-option v-for="item in videoRecordingOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="date" required>
                  <el-date-picker v-model="argumentForm.date" type="date" placeholder="选择一个日期"
                    :disabled-date="disabledDate" :shortcuts="shortcuts" size="small" value-format="YYYY-MM-DD"
                    @change="console.log(date);" />
                </el-form-item>
              </template>
            </el-form>
            <el-switch v-model="topic" style="--el-switch-on-color: #4C4D4F; --el-switch-border-color: none"
              :active-action-icon="Moon" :inactive-action-icon="Sunny" @change="handleTopic" />
          </div>
        </div>
      </el-header>
      <!-- <div class="tagBox">
        <el-tag style="margin: 0 5px; cursor: pointer;" v-for="(tag, index) in dynamicTags"
          :type="tagActive === index ? 'primary' : 'info'" size="large" :key="tag" :closable="tag.closable"
          :disable-transitions="false" @close="handleClose(tag)" @click="handleTag(index)">
          {{ tag.name }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="width: 80px;" size="default"
          @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="default" @click="showInput">
          +
        </el-button>
        <el-tabs style="width: 100%;" v-model="editableTabsValue" type="card" editable class="demo-tabs"
          @edit="handleTabsEdit">
          <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name"
            style="border: red solid 1px; color: black;">
            {{ item.content }}
          </el-tab-pane>
        </el-tabs>
      </div> -->
      <el-container style="overflow-y: auto;">
        <el-aside class="aside" width="300px">
          <div class="searchBox">
            <el-input v-model="searchVal" placeholder="搜索..." @input="handleSearch">
              <template #suffix>
                <el-icon class="el-input__icon">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <el-scrollbar>
            <el-menu default-active="1" :background-color="topic ? '#545c64' : ''" :text-color="topic ? '#fff' : ''"
              :active-text-color="topic ? '#ffd04b' : ''" :default-openeds="openedsList">
              <template v-for="item in cameraList" :key="item.id">
                <MenuItem :item="item" @item-click="handleMenuItem" />
              </template>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <el-scrollbar>
            <div class="videoBox">
              <DhPlayer ref="dh" @snumChange="snumChange" />
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
    <!-- <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
      <el-form :model="form">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: white;
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: white;
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  height: 100%;
  right: 20px;
}

.dhBox {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
}

.dhBox .videoBox {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border: gainsboro solid 1px;
}

.dhBox .tagBox {
  width: 100%;
  padding: 10px 0;
  border-top: gainsboro solid 1px;
  border-bottom: gainsboro solid 1px;
}

.aside {
  scrollbar-width: none;
}

.el-form-item {
  margin-bottom: 0;
}
</style>

<style lang="scss">
.dark {
  .el-header {
    background: #545c64 !important;
    border-bottom: #303133 solid 1px;
  }

  .aside {
    background: #545c64 !important;
  }

  .el-form {
    .el-form-item__label {
      color: white;
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  h2 {
    color: white;
  }

  .el-input__icon {
    color: white;
  }

  .searchBox {
    background: #545c64;
    // padding: 10px;
  }

  .el-select {
    .el-select__wrapper {
      background: #303133 !important;
      box-shadow: none;

      .el-select__selected-item {
        color: white;
      }
    }
  }

  .el-input__wrapper {
    background: #303133 !important;
    box-shadow: none;
  }

  .el-input__inner {
    color: white
  }

  #dhplayer-dom {
    color: white;
    background: rgb(20, 20, 20) !important;
  }
}
</style>