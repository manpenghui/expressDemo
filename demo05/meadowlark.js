var experss = require("express");
var fortunes = require("./lib/fortune.js");
var credentials = require('./lib/credentials.js');
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
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require("express-session")());
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");
app.set('port', process.env.PORT || 3000);

app.get("/", function(req, res) {
    // res.clearCookie('monster');
    req.session.userName="jack";
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', { signed: true });

    res.render('home');
});
app.get("/about", function(req, res) {
    res.set("Content-Type", "text/plain");

  res.clearCookie('monster');
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
