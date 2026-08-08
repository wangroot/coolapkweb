"# coolapkweb" 
# 酷安轻量级网页代理服务，node版本

初始化 Node.js 项目（-y 表示全部使用默认设置快速生成）
npm init -y

安装依赖包
npm install express cors axios

运行后端服务
node server.js

访问前端页面
http://localhost:3000/index.html

接口api
    1. 首页与信息流 (Main & Feed)
    首页模块与 Tab 初始化：
    GET /v6/main/init

    全站主页 / 推荐信息流 (V8)：
    GET /v6/main/indexV8?page={page}

    头条 / 酷图 / 话题等独立页面数据：
    GET /v6/page/dataList?url={url_path}&page={page}

    热搜词列表：
    GET /v6/search/hotSearchWords

    2. 动态与内容详情 (Detail & Social)
    动态详情（图文、问答、头条）：
    GET /v6/feed/detail?id={feed_id}

    动态的评论列表：
    GET /v6/feed/replyList?id={feed_id}&page={page}&listType={type}

    发布动态 / 回复 (POST)：
    POST /v6/feed/createFeed

    点赞 / 赞赏 / 收藏：
    POST /v6/feed/like

    3. 用户与账号 (User & Auth)
    检查当前 Token / Cookie 登录状态：
    GET /v6/user/space?uid={uid}

    获取个人动态历史：
    GET /v6/user/feedList?uid={uid}&page={page}

    获取用户关注 / 粉丝列表：
    GET /v6/user/followList 或 GET /v6/user/fansList

    4. 搜索接口 (Search)
    综合搜索：
    GET /v6/search?type=all&searchValue={keywords}&page={page}

    # 项目参考
    https://github.com/Coolapk-UWP/Coolapk-Lite/tree/master
    