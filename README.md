# dahuaTemplate
### 大华插件集成模板

模板使用 Vue3 的方式对大华的插件进行集成，插件需从官方下载，网址：https://open-icc.dahuatech.com/dhplayer/

**注：启动项目前需要插件本身已启动好，不然会导致无法查看**

#### 使用前需下载依赖

```bash
npm install
```

#### 配置平台参数

src/components/DhPlayer/index.vue

```javascript
pluginLoginInfo: { // 传入 icc 平台的登录信息
    host: '', // icc 平台ip
    port: '', // icc 平台端口 https 默认 443
    username: '', // icc 平台用户名
    password: '', // icc 平台密码
},
```

#### 启动项目

```bash
npm run dev
```

