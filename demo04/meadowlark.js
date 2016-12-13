var experss = require("express");
var fortunes = require("./lib/fortune.js");
var formidable=require('formidable');
var block = require("./lib/block.js");
var weather = require('./lib/weather.js')
var handlebars = require("express3-handlebars").create({
    defaultLayout: "main",
    // extname:'.hbs'
});
var app = experss();
app.use(experss.static(__dirname + "/public"));
app.use(require('body-parser')());

app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.set('port', process.env.PORT || 3000);

app.get("/", function(req, res) {
    res.render('home');
});
app.get("/about", function(req, res) {
    res.set("Content-Type", "text/plain");
    var s = "";
    for (var name in req.headers) {
        s += name + ":" + req.headers[name] + "\n";
    };
    res.send(s)
    // res.render('about');
});
app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
})
app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate')
})
app.get('/newsletter',function(req,res){
  res.render('newsletter',{
    csrf: 'CSRF token goes here'
  })
})
app.post('/process', function(req, res){
  if(req.xhr || req.accepts('json,html')==='json'){
  // 如果发生错误，应该发送 { error: 'error description' }
    res.send({ success: true });
  }
  else {
     // 如果发生错误，应该重定向到错误页面
    res.redirect(303, '/thank-you');
  }
});
app.get('/block', function(req, res) {
    res.render('block', {
        currency: {
            name: 'United States dollars',
            abbrev: 'USD'
        },
        tours: [
            {
                name: 'Hood River',
                price: '$99.95'
            }, {
                name: 'Oregon Coast',
                price: '$159.95'
            }
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'GBP', 'BTC']
    })
});
app.get('/photo',function(req,res){
  var now = new Date();
  res.render('vacation-photo',{
    year: now.getFullYear(),month: now.getMonth()
  });
});
app.post('/contest/vacation-photo/:year/:month', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err) return res.redirect(303, '/error');
    console.log('received fields:');
    console.log(fields);
    console.log('received files:');
    console.log(files);
    res.redirect(303, '/thank-you');
   });
 });

//定制404页面
app.use(function(req, res) {
    res.status(404)
    res.render('404');

});
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(505)
    res.render('505');
});

function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)'
            }, {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)'
            }, {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)'
            }
        ]
    };
}
app.use(function(req, res, next) {
    if (!res.locals.partials)
        res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

//app.use 是 Express 添加中间件的一种方法。可以把它看作处理所有没有路由匹配路径的处理器
app.listen(app.get('port'), function() {
    console.log("express started on " + app.get('port'));
});
