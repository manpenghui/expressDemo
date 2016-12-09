var experss=require("express");
var fortunes=require("./lib/fortune.js")
var handlebars=require("express3-handlebars")
    .create({
      defaultLayout:"main",
      // extname:".hbs"
    });
var app=experss();
app.use(experss.static(__dirname+"/public"));

app.engine('handlebars',handlebars.engine);
app.set("view engine","handlebars");
app.set('port',process.env.PORT||3000);

app.get("/",function(req,res){
    res.render('home');
});
app.get("/about",function(req,res){

    res.render('about');
});
app.get('/tours/hood-river',function(req,res){
  res.render('tours/hood-river');
})
app.get('/tours/request-group-rate',function(req,res){
  res.render('tours/request-group-rate')
})

//定制404页面
app.use(function(req,res){
     res.status(404)
     res.render('404');

});
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.type('text/plain');
    res.status(505)
    res.render('505');
});
//app.use 是 Express 添加中间件的一种方法。可以把它看作处理所有没有路由匹配路径的处理器
app.listen(app.get('port'),function(){
  console.log("express started on "+app.get('port'));
})
