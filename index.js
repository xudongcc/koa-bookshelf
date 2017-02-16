const path = require('path');

module.exports = function (dir, config) {
  // 处理路径
  if (typeof ((config || {}).connection || {}).filename !== 'undefined') {
    config.connection.filename = path.join(path.dirname(module.parent.filename), config.connection.filename);
  }

  const knex = require('knex')(config);
  const bookshelf = require('bookshelf')(knex);

  var models = new Proxy({}, {
    get: function (obj, prop) {
      if (typeof obj[prop] === 'undefined') {
        try {
          var modelPath = path.join(process.cwd(), dir, prop);
          var modelImport = require(modelPath);
        } catch (err) {
          err.message = 'Cannot find model ' + prop + ' \'' + modelPath + '\'';
          throw (err);
        }

        obj[prop] = modelImport(bookshelf, models);
      }

      return obj[prop];
    }
  });

  return async function (ctx, next) {
    ctx.models = models;
    await next();
  };
};