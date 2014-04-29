var decisionController = require('./controllers/decision.js');
var marketshareController = require('./controllers/marketshare.js');
var allResultsController = require('./controllers/allresults.js');
var initController = require('./controllers/init.js');


module.exports = function(app){
    app.get('/', function(req, res, next){
        res.render('index.ejs', {});
    });

    app.get('/api/init', initController.init);
    app.get('/api/decision', decisionController.getDecision);
    app.get('/api/marketshare', marketshareController.getMarketshare);
    app.get('/api/getAllResults', allResultsController.getAllResults);
};