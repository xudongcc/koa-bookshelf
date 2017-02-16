const Koa = require('koa');
const bookshelf = require('../index.js');

const app = new Koa();

app.use(bookshelf('/test/models', {
  client: 'sqlite3',
  connection: {
    filename: "./test.db"
  }
}));

app.use(async function (ctx, next) {
  const User = ctx.models.User;
  const Post = ctx.models.Post;
  var users = await User.where({}).fetchAll();

  ctx.body = users;
});

app.listen(3000);