var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
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

// 路由挂载到 app 中
app.use(router)

app.get('/', function (req,res) {
    res.render('index.html')
})

app.listen(3000, function () {
    console.log('running...')
})