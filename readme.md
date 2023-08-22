# 一 初始化项目&安装插件

```
npm init -y
npm i ejs
npm i express
```

# 二 路由跳转

```
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
```

# 三 接口请求

1. post请求。并且数据类型是表单。

   ```
   <form id="editForm">
           <input type="hidden" name="id" id="inphide" value="<%=index%>">
         <div>用户名：
           <input type="text" name="username" id="username">
         </div>
         <div>密码：
           <input type="text" name="password" id="password">
         </div>
         <input type="submit" value="修改">
       </form>
   
   
   
   $('#editForm').submit(function(event){
       let username = $('#username').val();
       let password = $('#password').val();
       event.preventDefault();//阻止默认行为
       $.ajax({
         url:'/doedit',
         type:'post',
         data:{
           username:username,
           password:password,
           id:$('#inphide').val()
         },
         success:(res)=>{
           if(res.code == 200){
             alert('修改成功');
             location.href = '/index';
           }
         }
       })
     })
   ```

   ```
   //表单提交必配
   app.use(express.urlencoded());
   ```

   ```
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
   ```

2. get请求

   ```
   $('#registerForm').submit(function (event) {
       let username = $('#username').val();
       let password = $('#password').val();
       event.preventDefault();//阻止默认行为
       $.ajax({
         url: '/doregister?username=' + username + '&password=' + password,
         type: 'get',
         success: (res) => {
           alert('注册成功')
           $('#username').val('');
           $('#password').val('');
         }
       })
     })
   ```

   ```
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
   ```

# 四 静态托管

1. 在根目录下新建目录`public`，在里面新建文件夹`javascripts`。

   ```
   app.use(express.static(__dirname + '/public'));
   //在ejs文件里引入
   <script src="/javascripts/register.js"></script>
   ```

# 五 ejs

1. 循环渲染: `<% for(var i=0;i<list.length;i++){ %>......<% } %>`

2. 变量：`<%= i %>`

   ```
   <ul>
       <% for(var i=0;i<list.length;i++){ %>
         <li>用户名:
           <%=list[i].username %> --- 密码:
             <%=list[i].password %>
               <a href="/edit/<%= i %>">修改</a>
               <button data-index="<%= i %>" class="delBtn">删除</button>
         </li>
         <% } %>
     </ul>
   ```

3. 注意：ejs不支持`模板字符串`。

4. 获取点击按钮的`index`属性

   ```
   let btns = document.getElementsByClassName('delBtn');
     for (let i = 0; i < btns.length; i++) {
       btns[i].onclick = function () {
         const index = $(this).data('index');
         console.log(index);
         $.ajax({
           url: '/deleteuser?index=' + i,
           success: (res) => {
             if (res.code == 200) {
               alert(res.msg)
               window.location.reload();//重新加载
             }
           }
         })
       }
     }
   ```

# 六 易错点

1. `get`请求记得在地址后拼接数据，否则获取不到`req.query`

   ```
   app.get(path,(req,res)=>{
   
   })
   ```

2. `post`请求携带数据时，当数据是表单时，必须添加`app.use(express.urlencoded());`；当数据是json数据时，必须添加`// 设置解析 JSON 数据的中间件 app.use(express.json());`

   ```
   app.post(path,(req,res)=>{
   
   })
   ```

3. 配置动态路由

   ```
   app.get('/edit/:index', (req, res) => {
     res.render('edit',req.params)
   })
   ```

4. 处理请求时，只能有一个响应。`res.render()/res.json()/res.send()`

5. `res.render(name,data)`：用于渲染一个视图模板并将其发送到客户端。name指的是`views`目录下的ejs文件名。`data`是后台发送给ejs文件的数据。

6. `res.json()`：通常是请求接口返回的数据。发送 JSON 格式的响应

   ```
   res.json({
         code: 200,
         msg: '注册成功'
       })
   ```

7. `res.send(msg)`：这个方法用于发送响应数据，可以是字符串、HTML、JSON 或其他数据。根据发送的数据类型自动设置响应头。`msg`会显示在页面里。