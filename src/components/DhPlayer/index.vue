<script setup>
import { ref, onMounted , defineEmits } from 'vue'

const emit = defineEmits(['snumChange'])

const myVideoPlayer = ref(null) // 插件实例
const mySnum = ref(0) // 当前单击窗口
const pluginStatus = ref(true)  // 插件状态
const loginStatus = ref(true) // 登录状态

// 加载完自动初始化插件
onMounted(() => {
  initDHPlayer()
})

/**
 * 初始化插件
 * @param windowType 播放器类型 ，必传， 0 - 实时预览，3 - 录像回放，7- 录像回放（支持倒放）
 */
function initDHPlayer(windowType = 0) {
  const dhDom = document.querySelector("#dhplayer-dom")
  dhDom.innerHTML = "正在初始化插件，初始化完后自动登录，请等待..."
  myVideoPlayer.value = new VideoPlayer({
    videoId: "dhplayer-dom", // 唯一标识，必填，不能重复
    windowType: windowType,
    usePluginLogin: true, // 采用登录 (请默认传true，插件内部自动拉流)
    pluginLoginInfo: { // 传入 icc 平台的登录信息
      host: '', // icc 平台ip
      port: '', // icc 平台端口 https 默认 443
      username: '', // icc 平台用户名
      password: '', // icc 平台密码
    },
    division: 16, // 默认展示的窗口数量， 必传
    draggable: false, // 窗口拖拽 【暂不支持】
    showBar: true, // 底部操作栏， 选传，【true - 显示, false - 隐藏】
    shieldClass: ['el-popper', 'el-overlay-dialog'], // 如果DOM元素被插件挡住了，把DOM元素的类名传入。
    coverShieldClass: [], // 如果插件要在dom内滚动，需要把DOM元素的类名传入，请查看案例-遮挡
    parentIframeShieldClass: [], // 有 iframe 时，top层 的 dom 元素被插件挡住了，把DOM元素的类名传入。
    // 下面均为回调函数，请按需使用，具体可在 API 内进行功能的体验和查看。

    // 创建播放器成功回调
    createSuccess: (versionInfo) => {
      // 该回调触发后，我们可以进行实时预览/录像回放等操作
      console.log(versionInfo.message);
    },
    // 创建播放器失败回调
    createError: (err) => {
      // 有错误码，可打印查看错误信息
      console.log(JSON.stringify(err));
      // 插件状态
      if (err.success === false) {
        pluginStatus.value = err.success
        dhDom.style.color = 'red'
        dhDom.innerHTML = err.message + '，请检查插件是否启动'
      }

      if (err.code === 1004) {
        loginStatus.value = false
        dhDom.innerHTML = ''
        // ElMessage.warning('登录失败')
      }
    },
    // 插件公共回调
    dhPlayerMessage: (info, err) => { },
    // 实时预览成功回调
    realSuccess: (info) => { },
    // 实时预览失败回调
    realError: (info, err) => { },
    // 对讲成功回调
    talkSuccess: (info) => { },
    // 对讲失败回调
    talkError: (info, err) => { },
    // 录像播放成功回调
    playbackSuccess: (info) => { },
    // 录像播放失败回调
    playbackError: (info, err) => { },
    // 录像播放完成回调
    playbackFinish: (info) => { },
    // 抓图成功回调
    snapshotSuccess: ({ base64Url, path }, info) => {
      var byteCharacters = atob(
        base64Url.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
      );
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var blob = new Blob([byteArray], {
        type: undefined,
      });
      var aLink = document.createElement("a");
      aLink.download = "图片名称.jpg"; //这里写保存时的图片名称
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    },
    // 本地录像下载成功回调
    videoDownloadSuccess: (path, info) => {
      alert("本地录像地址：" + path)
    },
    // 关闭视频窗口回调
    closeWindowSuccess: ({ isAll, snum, channelList }) => { },
    // 鼠标单击窗口回调
    clickWindow: (snum) => {
      mySnum.value = snum
      // 传递窗口索引给父组件
      emit('snumChange', snum)
    },
    // 鼠标双击窗口回调
    dbClickWindow: (snum) => { },
    // 播放器窗口的数量回调
    changeDivision: (division) => { },
    // rtsp 流下载录像成功回调
    downloadRecordSuccess: (info) => { },
    // rtsp 流下载录像失败回调
    downloadRecordError: (info, err) => { }
  })
}

// 播放视频
function startReal(channelId, channelName) {
  beforePlayVerify().then(() => {
    myVideoPlayer.value.startReal([{
      channelId: channelId, // 通道id 【必传】
      channelName: channelName, // 通道名称 (用于本地录像下载)
      snum: mySnum.value, // 即将要播放的窗口序号，从0开始 【必传】
      streamType: 2,  // 1-主码流  2-辅码流 (可不传，默认主码流)
      deviceType: 5, // 设备类别 (插件对讲时，需要配置该参数，否则无法对讲) 
      cameraType: '1',  // 摄像头类型 (用于云台)
      capability: '00000000000000000000000000000001', // 能力集 (用于云台)
      decodeMode: 2, // 软/硬解码 0-软解 2-快速硬解
    }])
  }).catch(err => {
    ElMessage(err)
  })
}

/**
 * 录像回放
 * @param channelId 通道id
 * @param channelName 通道名称 (用于本地录像下载和错误提示)
 * @param date 日期
 * @param recordSource 2-录像 3-中心
 */
function startPlayback(channelId, channelName, date, recordSource) {
  beforePlayVerify().then(() => {
    myVideoPlayer.value.startPlayback(
      [{
        channelId: channelId,
        channelName: channelName,
        startTime: date + ' 00:00:00', // 开始时间
        endTime: date + ' 23:59:59', // 结束时间
        recordSource: recordSource || 3,
        streamType: 0, // 0-所有码流 1-主码流  2-辅码流
        snum: mySnum.value //  播放的窗口序号 (从0开始计数，表示第一个窗口)
      }]
    )
  }).catch(err => {
    ElMessage(err)
  })
}

// 播放前校验
function beforePlayVerify() {
  return new Promise((resolve, reject) => {
    if (!myVideoPlayer.value) {
      reject('不能播放，请先初始化插件！！！！！')
    }
    if (!pluginStatus.value) {
      reject('初始化失败，请检查插件！！！！！')
    }
    if (!loginStatus.value) {
      reject('登录失败，请切换重试')
    }
    resolve()
  })
}

// 重新初始化插件
function reinitialize(type) {
  myVideoPlayer.value.destroy().then(() => {
    // ElMessage.success('销毁成功')
    initDHPlayer(type)
  })
}

defineExpose({
  startReal,
  startPlayback,
  reinitialize
});

</script>

<template>
  <div id="dhplayer-dom"></div>
</template>

<style scoped>
#dhplayer-dom {
  width: 100%;
  height: 100%;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>