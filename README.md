# coolapkweb

酷安轻量级网页代理服务，Node.js 版本。

## 快速开始

### 1. 安装 Node.js

根据您的操作系统，选择以下方式之一安装 Node.js（推荐使用 LTS 版本，且版本建议 >= 16.0.0）：

*   **Windows & macOS**: 前往 [Node.js 官方网站](https://nodejs.org/) 下载并运行安装包。
*   **Linux (Ubuntu/Debian)**:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
*   **macOS (Homebrew)**:
    ```bash
    brew install node
    ```

安装完成后，可在终端运行以下命令验证是否安装成功：

```bash
node -v
npm -v
```

### 2. 初始化 Node.js 项目

运行以下命令快速生成默认的 `package.json`：

```bash
npm init -y
```

### 3. 安装依赖包

```bash
npm install express cors axios
```

### 4. 运行后端服务

```bash
node server.js
```

### 5. 访问前端页面

在浏览器中打开：
[http://localhost:3000/index.html](http://localhost:3000/index.html)

---

## 接口 API

### 1. 首页与信息流 (Main & Feed)

*   **首页模块与 Tab 初始化**
    *   请求方式：`GET`
    *   路径：`/v6/main/init`
*   **全站主页 / 推荐信息流 (V8)**
    *   请求方式：`GET`
    *   路径：`/v6/main/indexV8?page={page}`
*   **头条 / 酷图 / 话题等独立页面数据**
    *   请求方式：`GET`
    *   路径：`/v6/page/dataList?url={url_path}&page={page}`
*   **热搜词列表**
    *   请求方式：`GET`
    *   路径：`/v6/search/hotSearchWords`

### 2. 动态与内容详情 (Detail & Social)

*   **动态详情（图文、问答、头条）**
    *   请求方式：`GET`
    *   路径：`/v6/feed/detail?id={feed_id}`
*   **动态的评论列表**
    *   请求方式：`GET`
    *   路径：`/v6/feed/replyList?id={feed_id}&page={page}&listType={type}`
*   **发布动态 / 回复**
    *   请求方式：`POST`
    *   路径：`/v6/feed/createFeed`
*   **点赞 / 赞赏 / 收藏**
    *   请求方式：`POST`
    *   路径：`/v6/feed/like`

### 3. 用户与账号 (User & Auth)

*   **检查当前 Token / Cookie 登录状态**
    *   请求方式：`GET`
    *   路径：`/v6/user/space?uid={uid}`
*   **获取个人动态历史**
    *   请求方式：`GET`
    *   路径：`/v6/user/feedList?uid={uid}&page={page}`
*   **获取用户关注 / 粉丝列表**
    *   请求方式：`GET`
    *   路径：`/v6/user/followList` 或 `/v6/user/fansList`

### 4. 搜索接口 (Search)

*   **综合搜索**
    *   请求方式：`GET`
    *   路径：`/v6/search?type=all&searchValue={keywords}&page={page}`

---

## 项目参考

*   [Coolapk-Lite (GitHub)](https://github.com/Coolapk-UWP/Coolapk-Lite/tree/master)
