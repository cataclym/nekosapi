# nekosapi
[![npm version](https://badge.fury.io/js/nekosapi.svg)](https://badge.fury.io/js/nekosapi)

### Async wrapper for [Nekos API](https://nekosapi.com/) 
Supports NekosAPI **v1** and **v3** 

## [Documentation](https://cataclym.github.io/nekosapi/)

### Quick overview
#### Import NekosAPI v3:
```ts
// TypeScript
import NekosAPI from "nekosapi";
// JavaScript
const { NekosAPI } = require("nekosapi");

const api = new NekosAPI();

api.getRandomImage("Catgirl")
    .then(image => console.log(image));
```

#### Import NekosAPI v1:
```js
const { NekosAPIv1 } = require("nekosapi");
// Or using /v1 path
const { NekosAPI } = require("nekosapi/v1");
// Or using default export in /v1 path
import NekosAPI from "nekosapi/v1";

// The constructor accepts a token
const api = new NekosAPI();

// Returns NekosImage object
api.getRandomImage("Catgirl")
    .then(image => console.log(image));
```

**Node version guide**

| nekosapi version | Recommended | Minimum | npm                       |
|------------------|-------------|---------|---------------------------|
| 0.4.4            | 18.x, 20.x  | 18.x    | `npm i nekosapi`          |
| 0.4.3 - (v1 only)| 18.x, 20.x  | 18.x    | `npm i nekosapi@0.4.3 -E` |
| 0.3.3 - (v1 only)| 18.x, 20.x  | 16.x    | `npm i nekosapi@0.3.3 -E` |
[Guide for using 0.3.3 - 0.4.3](src/v1/README.md)

### [Source code](https://github.com/cataclym/nekosapi)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3IJV8A)
