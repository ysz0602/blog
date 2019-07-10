var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

// 在 Node 中，有很多第三方模板引擎都可以使用（注意：一定要在 app.use(router) 之前）
// ejs、jade(pug)、handlebars、nunjucks
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

// 配置解析表单 POST 请求体插件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 在 Express 这个框架中，默认不支持 Session 和 Cookie
// 但是我们可以使用第三方中间件：express-session 来解决
// 1.npm install express-session
// 2.配置(一定要在 app.use(router) 之前)
// 3.使用
// 档把这个插件配置好之后，我们就可以通过 req.session 来发访问和设置 Session 成员了
// 添加 Session 数据：req.session.foo = 'bar'
// 访问 Session 数据：req.session.foo
app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: true // 无论你是否使用 session 我都会默认直接给你分配一把钥匙
}))


// 路由挂载到 app 中
app.use(router)

app.get('/', function (req,res) {
    res.render('index.html')
})

app.listen(3000, function () {
    console.log('running...')
})