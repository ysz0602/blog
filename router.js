var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
    console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res) {
    // 1. 获取表单数据
    // 2. 查询数据库用户名密码是否正确
    // 3. 发送响应数据
    var body = req.body
    User.findOne({
       email: body.email,
       password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: "邮箱或者密码错误"
            })
        }

        // 用户存在，登录成功， 通过 session 记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: "ok"
        })
    })
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', function (req, res) {
   // 1. 获取表单提交的数据
   // req.body
   // 2. 操作数据库
   // 判断该用户是否存在
   // 如果已存在，不允许注册
   // 如果不存在，注册新用户
   // 3. 发送响应
   var body = req.body
    User.findOne({
        $or: [
            { email: body.email },
            { nickname: body.nickname }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: "服务端错误"
            })
        }
        console.log(data)
        // 如果邮箱已存在
        // 判断昵称
        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: "邮箱或者昵称已存在"
            })
        }

        // 对密码进行 m5 两次加密
        body.password = md5(md5(body.password))
        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: "服务端错误"
                })
            }
            // 注册成功，使用 Session 记录用户登录状态
            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: "ok"
            })
        })        
    })
})

router.get('/logout', function (req, res) {
    // 清除登录状态
    req.session.user = null
    // 重定向登录页
    res.redirect('/login')
})

module.exports = router