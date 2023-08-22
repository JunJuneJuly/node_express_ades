const express = require('express');
const fs = require('fs');
const app = new express();

app.set('view engine', 'ejs')
//表单提交必配
app.use(express.urlencoded());
//设置静态文件目录（用于存放客户端 JavaScript）
app.use(express.static(__dirname + '/public'));
//渲染页面(路由)
app.get('/register', (req, res) => {
  res.render('register')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/edit/:index', (req, res) => {
  res.render('edit',req.params)
})
app.get('/index', (req, res) => {
  let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
  res.render('index', {
    list: userList
  })
})
//请求
app.get('/doregister', (req, res) => {
  let { username, password } = req.query
  if (username && password) {
    let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
    userList.push({ username, password });
    fs.writeFileSync('./data/user.json', JSON.stringify(userList));
    res.json({
      code: 200,
      msg: '注册成功'
    })
  }
})
app.post('/dologin', (req, res) => {
  let data = req.body;
  let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].username == data.username && userList[i].password == data.password) {
      res.json({
        code: 200,
        msg: '登陆成功'
      })
    }
  }
})
app.get('/deleteuser', (req, res) => {
  let index = req.query;
  let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
  userList.splice(index, 1);
  fs.writeFileSync('./data/user.json', JSON.stringify(userList));
  res.json({
    code: 200,
    msg: '删除成功'
  })
})
app.get('/user',(req,res)=>{
  let index = req.query.id
  let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
  res.json({
    code:200,
    user:userList[index]
  })
})
app.post('/doedit',(req,res)=>{
  let { username, password, id } = req.body;
  let userList = JSON.parse(fs.readFileSync('./data/user.json')) || [];
  userList.splice(id,1,{username,password});
  fs.writeFileSync('./data/user.json', JSON.stringify(userList));
  res.json({
    code: 200,
    msg: '修改成功'
  })
})
app.listen(8000)