module.exports = exports = function apiQueryPlugin (schema) {

  schema.statics.apiQuery = function(rawParams, cb) {

    var convertToBoolean = function (str) {
      if (str.toLowerCase() === "true" ||
          str.toLowerCase() === "t" ||
          str.toLowerCase() === "yes" ||
          str.toLowerCase() === "y" ||
          str === "1"){
        return true;
      } else {
        return false;
      }
    };

    var searchParams = {}
      , query
      , page;

    var parseSchemaForKey = function (schema, keyPrefix, lcKey, val, option) {

      var addSearchParam = function (param) {
        for (var key in param) {
          searchParams[keyPrefix + key] = param[key];
        }
      };

      var param = {};

      if (matches = lcKey.match(/(.+)\.(.+)/)) {
        // parse subschema
        if (schema.paths[matches[1]].constructor.name === "DocumentArray") {
          parseSchemaForKey(schema.paths[matches[1]].schema, matches[1] + ".", matches[2], val, option)
        }

      } else if (lcKey === "" || typeof schema.paths[lcKey] === "undefined"){
        // nada

      } else if (schema.paths[lcKey].constructor.name === "SchemaBoolean") {
        param[lcKey] = convertToBoolean(val);

      } else if (schema.paths[lcKey].constructor.name === "SchemaString") {

        if (val.match(',')) {
          var options = val.split(',').map(function(str){
            return new RegExp(str, 'i');
          });

          if (option === "all") {
            param[lcKey] = {$all: options};
          } else {
            param[lcKey] = {$in: options};
          }
        } else if (val.match(/([0-9]+)/)) {
          if (option === "gt" ||
              option === "gte" ||
              option === "lt" ||
              option === "lte") {
            param[lcKey] = {};
            param[lcKey]["$" + option] = val;
          } else {
            param[lcKey] = val;
          }
        } else {
          param[lcKey] = {$regex: val, $options: "-i"};
        }


      } else if (schema.paths[lcKey].constructor.name === "SchemaNumber") {

        if (val.match(/([0-9]+,?)/) && val.match(',')) {
          if (option === "all") {
            param[lcKey] = {$all: val.split(',')};
          } else {
            param[lcKey] = {$in: val.split(',')};
          }
        } else if (val.match(/([0-9]+)/)) {
          if (option === "gt" ||
              option === "gte" ||
              option === "lt" ||
              option === "lte") {
            param[lcKey] = {};
            param[lcKey]["$" + option] = val;
          } else {
            param[lcKey] = val;
          }
        }
      }

      if (param) addSearchParam(param);
    };


    // Construct searchParams
    for (var key in rawParams) {
      var lcKey = key.toLowerCase()
        , option = rawParams[key].match(/\{(.*)\}/)
        , val = rawParams[key].replace(/\{(.*)\}/, '');

      if (option){
        option = option[1];
        if (option == "near") {
          // divide by 69 to convert miles to degrees
          var latlng = val.split(',');
          var distObj = {$near: [parseFloat(latlng[0]), parseFloat(latlng[1])]};
          if(typeof rawParams['radius'] !== 'undefined') {
            distObj.$maxDistance = parseFloat(rawParams['radius']) / 69;
          }
          searchParams[key] = distObj;
        }
      }

      if (val === "") continue;

      if (lcKey === "page") {
        page = parseInt(val, 10);

      } else {
        parseSchemaForKey(this.schema, "", lcKey, val, option);
      }
    }

    // Create the Mongoose Query object.
    query = this.find(searchParams);

    if (page > 0) {
      skip = (page - 1);
      query.skip(skip);
    }

    if (cb) {
      query.exec(cb);
    } else {
      return query;
    }
  };
};