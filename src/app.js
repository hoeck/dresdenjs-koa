import Koa from 'koa';

const app = new Koa();

app.use(function * () {
    this.body = 'hello world from Koa';
});

app.listen(3000);
