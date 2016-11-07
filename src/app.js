import Koa from 'koa';

const app = new Koa();

app.use(function * (next) {
    console.log(`before: ${this.method} ${this.url}`);

    yield next;

    console.log(`after: ${this.method} ${this.url} ${this.status}`);
});

app.use(function * () {
    this.body = 'hello world from Koa';
});

app.listen(3000);
