exports.init = function(app){
  app.get('/test1', require('./controllers/test1').index);
};