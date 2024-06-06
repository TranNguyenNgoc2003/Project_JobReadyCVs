var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var Database = require('./db/database');
var routes = require('./routes/controller');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.listen(3000, function () {
    console.log("Starting at port 3000...");
});