module.exports = function (bookshelf, models) {
  return bookshelf.Model.extend({
    tableName: 'users',
  });
}