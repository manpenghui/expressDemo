var experss=require("express");
var handlebars=require("express3-handlebars")
    .create({
      defaultLayout:"main",
      // extname:".hbs"
    });
var app=experss();
app.use(experss.static(__dirname+"/public"));
//下面这段代码创建了一个视图引擎，并对 Express 进行了配置，将其作为默认的视图引擎。接 下来创建 views 目录，在其中创建一个子目录 layouts。如果你是一位经验丰富的 Web 开发 人员，可能已经熟悉布局的概念了（有时也被称为“母版页”）。在开发网站时，每个页面 上肯定有一定数量的 HTML 是相同的，或者非常相近。在每个页面上重复写这些代码不仅 非常繁琐，还会导致潜在的维护困境：如果你想在每个页面上做一些修改，那就要修改所 有文件。布局可以解决这个问题，它为网站上的所有页面提供了一个通用的框架。
// handlebars.create({defaultLayout:"main"});//指明了默认布局（defaultLayout:'main'）。这就意味 着除非你特别指明，否则所有视图用的都是这个布局。
app.engine('handlebars',handlebars.engine);
app.set("view engine","handlebars");
// 用 res.set 和 res.status 替换了 Node 的 res.writeHead
app.set('port',process.env.PORT||3000);
//在 Express 中，路由和中间件的添加顺序至关重要。如果我们把 404 处理器放在所有路由上面，那首页和关于页面就不能用了，访问这些 URL 得到的都 是 404。现在我们的路由相当简单，但其实它们还能支持通配符，这会导致顺序上的问题。
app.get("/",function(req,res){
  // res.type('text/plain');
  // res.send("home")
    res.render('home');
    //需要注意，我们已经不再指定内容类型和状态码了：视图引擎默认会返回 text/html 的内容类型和 200 的状态码
});
app.get("/about",function(req,res){
  // res.type('text/plain');
  // res.send("about")
  var fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.", ];

      res.render('about',{fortunes});
});

//定制404页面
app.use(function(req,res){
  // res.type("text/plain");
  // res.status(404);
  // res.send('404 not found');
     res.status(404)
     res.render('404');
//在 catch-all 处理器（提供定制的 404 页面）以及 500 处理器中， 我们必须明确设定状态码。
});
//定制505页面
//Express 能根据回调函数中参数的个数区分 404 和 500 处理器。
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.type('text/plain');
  // res.status(500);
  // res.send('500-server error');
    res.status(505)
    res.render('505');
});
//app.use 是 Express 添加中间件的一种方法。可以把它看作处理所有没有路由匹配路径的处理器
app.listen(app.get('port'),function(){
  console.log("express started on "+app.get('port'));
})
