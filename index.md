## what is koa?

* it is a nodejs web framework
* it uses generators/asnyc+await
* designed by the team behind express

---

## setup

`npm install --save koa`

---

## hello world

```javascript
import Koa from 'koa';

const app = new Koa();

app.use(function * () {
    this.body = 'hello world from Koa';
});

app.listen(3000);
```
