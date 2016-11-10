# Intro

---

### What Is Koa?

* it is a nodejs web framework
* it uses generators/asnyc+await
* designed by the team behind express

---

### Who Am I?

- Andre Leubner
- Javascript Dev at Lovoo
- We use Koa in *production*

---

### Setup

`npm install --save koa`

---

### Hello World

```javascript
import Koa from 'koa';

const app = new Koa();

app.use(function * () {
    this.body = 'hello dresdenjs';
});

app.listen(3000);
```

---

### Hello World, Asnychronous

```javascript
import Koa from 'koa';
import request from 'request-promise-json';

const app = new Koa();

app.use(function * () { /* ... */ });

app.listen(3000);
```

Note:
* biggest selling point

---

### Hello World, Asnychronous

```javascript
// respond with the hackernews topstory
app.use(function * () {
    const url = 'https://hacker-news.firebaseio.com/v0';
    const id = yield request.get(`${url}/topstories.json`))[0];
    const story = yield request.get(`${url}/item/${id}.json`);

    this.body = `<h1>topstory: ${story.title}</h1>`;
});
```

Note:
* this is the main reason we chose Koa
* we don't have any callback code in our nodejs project

---

![](assets/remove-all-the-callbacks.jpg) <!-- .element: style="transform: scale(2)" -->

Note:
* I would have had a hard time without yield
* but there is more ...

---

# features

---

### Simple Request Handlers

* Koa *wraps* nodes req and res objects
* all is done on the context object (`this` or `ctx`)
* request: `get()`, `cookies.get()`, `query`, `params`
* response: `body`, `status`, `set()` for headers, `redirect()` and many more
* [documentation](https://github.com/koajs/koa/blob/master/docs/api/context.md) is a bit hard to find

---

### Simple Request Handlers

```javascript
app.use(function * () {
    this.status = 202;
    this.body = {
        json: 'response',
        query: this.query,
        headers: this.headers
    };
});
```

---

### Easy To Use Middlewares

* used in express and other web frameworks
* add behavior *around* request handlers
* generators + middlewares -> win win win

Note:
* express design team

---

### Easy To Use Middlewares

```javascript
app.use(function * (next) {
    console.log('before');

    yield next; // <--- pass control to other middleware

    console.log('after');
});
```

---

### Passing Control

```javascript
app.use(function * outer (next) {
    console.log('outer before');
    yield next;
    console.log('outer after')
});

app.use(function * inner (next) {
    console.log('inner before');
    yield next;
    console.log('inner after')
});

app.use(function * handler () {
    console.log('handler')
});
```

<span class="fragment current-visible" data-code-focus="1"></span>
<span class="fragment current-visible" data-code-focus="2"></span>
<span class="fragment current-visible" data-code-focus="3"></span>
<span class="fragment current-visible" data-code-focus="7"></span>
<span class="fragment current-visible" data-code-focus="8"></span>
<span class="fragment current-visible" data-code-focus="9"></span>
<span class="fragment current-visible" data-code-focus="13"></span>
<span class="fragment current-visible" data-code-focus="14"></span>
<span class="fragment current-visible" data-code-focus="15"></span>
<span class="fragment current-visible" data-code-focus="10"></span>
<span class="fragment current-visible" data-code-focus="11"></span>
<span class="fragment current-visible" data-code-focus="4"></span>
<span class="fragment current-visible" data-code-focus="5"></span>
<span class="fragment current-visible" data-code-focus=""></span>

Note:
* how are middlewares executed

---

### Middleware: logging

```javascript
app.use(function * (next) {
    console.log(`${this.method} ${this.url}`);

    yield next; // <--- pass control to other middleware
});
```

---

### Middleware: error handling

```javascript
app.use(function * (next) {
    try {
        yield next;
    } catch (e) {
        const msg = `Error on ${this.method} ${this.url}:`;
        console.error(msg, error.stack);

        this.status = 500;
        this.body = 'Internal Server Error';
    }
});
```

Note:
* readable javascript
* we use exactly that pattern in practice (except for nicer error formatting)

---

### Middleware Library: Sessions

```javascript
import session from 'koa-session-store';

app.keys = ['random secret'];

app.use(session()); // session is a middleware
```

Note:
* additional functionality is often provided through middlewares: csrf token protection, caching
* no prepackaged middleware for koa
* easy composition

---

### Middleware Library: Routing

```javascript
    import KoaRouter from 'koa-router';

    const router = new KoaRouter();

    app.use(router); // the router is a middleware

    router.get('/hello', function *() {
        this.body = 'Hello World!';
    });
```

Note:
* that was basically it, from a documentation point of view
* no some real-world experience

---

# Experience

Note:
* use it in production for 3 months now
* took around 4 months to move most logic from php to koa
* share some experiences

---

### file layout

```
core       .. logging, metrics, config
handlers   .. stateless modules implementing request handlers
services   .. stateful modules, e.g. db connections
views      .. templates
index.js   .. Koa app definition
```

Note:
* this works for mid-sized codebases like ours
* having a directory-per-component approach is better for larger projects

---

### unit tests

* mockery-next for mocking modules
* jasmine

---

### service tests

* Koa - mock HTTP APIs
* redmock - mock redis server
* jasmine
* custom gluecode to run the app with custom configuration

---

### Performance

* at peak, we're getting 77 reqs per second for one Koa instance
* almost all of them are proxied to our php api backend
* avg latency is 65ms, .99 is 500ms
* ~25% cpu usage

Note:
* we never had to tune the app for performance so far

---

### some bad things

* its hard to assess the quality of some Koa library
* sometimes there are competing middleware libraries
* inconsistent context object: this.get() for headers vs this.cookies.get() for cookies

Note:
* e.g. koa-generic-session: : sphaghetti like code, hard to read or extend, not maintained, hard to understand __defineGetter usage
* koa-router is nice and works well though
* we wrote our own session middleware
* generally, there seem to be no good session middlewares

---

### and the good things

```javascript
function* stripePurchaseHandler (next) {
    // ...

    const [bodyData, selfUser, userInfo] = yield [
        bodyParser.parseJson(this),
        userRequest.getSelfUser(requestInfo),
        userRequest.getUserInfo(this.session.userId)
    ];

    // ...

    try {
        yield goPaymentGateway.call(/* ... */);
    } catch (error) { /* ... */ }
}
```

Note:
* thats why we chose it
* co-worker recommended it
* lots of async calls to fetch data
* zero nesting!
* simple error handling (no need to `if (err) { return err; }`)

---

### more good things

* composable middlewares
* total freedom - pick what you need or write it yourself
* almost no magic in Koa itself

---

### when to use it?

* if you need the offered flexibility
* or if your app is more a microservice
* probably not a good choice for a stock database + form driven website
* (its not a web framework)

---

## any questions?

thanks for listening
