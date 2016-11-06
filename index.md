# intro

---

## what is koa?

* it is a nodejs web framework
* it uses generators/asnyc+await
* designed by the team behind express

---

## who am I?

- Erik Söhnel
- Javascript Dev at Lovoo
- We use Koa in production

---

## setup

`npm install --save koa`

---

## hello world

```javascript
import Koa from 'koa';

const app = new Koa();

app.use(function * () {
    this.body = 'hello dresdenjs';
});

app.listen(3000);
```

---

## hello world, asnychronous

```javascript
import Koa from 'koa';
import request from 'request-promise-json';

const app = new Koa();

app.use(function * () { /* ... */ });

app.listen(3000);
```

Note: biggest selling point
---

## hello world, asnychronous

```javascript
// respond with the hackernews topstory
app.use(function * () {
    const url = 'https://hacker-news.firebaseio.com/v0';
    const id = yield request.get(`${url}/topstories.json`))[0];
    const story = yield request.get(`${url}/item/${id}.json`);

    this.body = `<h1>topstory: ${story.title}</h1>`;
});
```

Note: this is the main reason we chose Koa
      we don't have any callback code in our nodejs project
---

![](assets/remove-all-the-callbacks.jpg) <!-- .element: style="transform: scale(2)" -->

Note: I would have had a hard time without yield
      but there is more

---

# features

---

## easy middlewares

* generators + middlewares -> win win win

Note: express design team
