exports.init = function(app){
  app.get('/test1', require('./controller'));
};