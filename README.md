# rest
简化操作数据云的rest框架

# Example

```js
var client = new Resource("appId", "appKey","请求地址，可省略");
```
```js
//多文件上传,一个表有多个file字段
var bb = client.Factory("bb");
api.getPicture({},function(ret,err){
	var path1=ret.data;
	api.getPicture({},function(ret,err){
  	var path2=ret.data;
  	bb.save({file1:{isFile:true,path:path1},file2:{isFile:true,path:path2}},function(data,err){
			alert(JSON.stringify(data));
		})
  });
	
})
```
```js
//上传文件到file表
var File = client.Factory("file");
api.getPicture({},function(ret,err){
	File.save({file:{isFile:true,path:ret.data}},function(data,err){
		alert("file:\t"+JSON.stringify(data));
		alert("file:\t"+JSON.stringify(err));
	})
})
```
## User表基本操作
```js
//新增
User.save({"username": username, "password": password,email:email}, function (ret,err) {
  console.log("user insert:"+JSON.stringify(ret))
  console.log("user insert:"+JSON.stringify(err))
});
User.findOne(function(ret,err){
	console.log("user findOne:"+JSON.stringify(ret));
	console.log("user update:"+JSON.stringify(err));
})
//更新
User.save({"_id":id},{email:email,emailVerified:true},function(ret,err){
	console.log("user update:"+JSON.stringify(ret));
});
//获取
User.get({"_id": id}, function (ret,err) {
    console.log("user get:"+JSON.stringify(ret))
});
//计数
User.count(function(ret,err){
	console.log("user count:"+JSON.stringify(ret))
})
//存在
User.exists({"_id":id},function(ret,err){
  console.log("user exists:"+JSON.stringify(ret))
})
//查询
User.query({
    filter: {
        "include": "many"
    }
}, function (ret,err) {
    console.log("user query:"+JSON.stringify(ret))
});
```
## User表特殊操作
```js
//登录
User.login({username: username, password: password}, function (ret,err) {
  console.log("user.login:"+JSON.stringify(ret))
  console.log("user.login:"+JSON.stringify(err))
});
//登出
User.logout({token: token}, function (ret,err) {
	console.log("user.logout:"+JSON.stringify(ret))
});
//发送验证邮件
User.verify({"email":email, "language":"zh_CN", "username":username},function(ret,err){
	console.log("verify ret:\t"+JSON.stringify(ret))
})
//发送重置密码邮件
User.reset({"id":id,"email":email, "language":"zh_CN", "username":username,access_token:token},function(ret,err){
	console.log("reset ret:\t"+JSON.stringify(ret))
})
```
#User表 Relation相关操作
```js
//获取
User.get({
  "_id": baseid,
  "_relation": "many"
}, function (ret,err) {
  console.log("aa get:"+JSON.stringify(ret));
});
//计数
User.count({
  "_id": baseid,
  "_relation": "many"
}, function (ret,err) {
  console.log("aa count:"+JSON.stringify(ret));
});
//删除
User.delete({
  "_id": baseid,
  "_relation": "many"
}, function (ret,err) {
  console.log("aa all delete:"+JSON.stringify(ret));
});
```
#File表 作为Relation的表的上传操作

需要增加isFileClass:true的选项

```js
//上传文件到file表
var RelationFile = client.Factory("relationFile");
api.getPicture({},function(ret,err){
	RelationFile.save({"_id":"{{id}}","_relation":"{{relationName}}"},{file:{isFileClass:true,isFile:true,path:ret.data}},function(data,err){
		alert("file:\t"+JSON.stringify(data));
		alert("file:\t"+JSON.stringify(err));
	})
})