# nekosapi
[![npm version](https://badge.fury.io/js/nekosapi.svg)](https://badge.fury.io/js/nekosapi)

[↰Back](../../README.md)

## Guide for 0.3.3 - 0.4.3

#### Import NekosAPI using version 0.3.3 - 0.4.3
```js
const { NekosAPI } = require("nekosapi");

// The constructor accepts a token
const api = new NekosAPI();

// Returns NekosImage object
api.getRandomImage("catgirl")
    .then(image => console.log(image));
```

**Node version guide**

| nekosapi version | Recommended | Minimum | npm                       |
|------------------|-------------|---------|---------------------------|
| 0.4.4            | 18.x, 20.x  | 18.x    | `npm i nekosapi`          |
| 0.4.3 - (v1 only)| 18.x, 20.x  | 18.x    | `npm i nekosapi@0.4.3 -E` |
| 0.3.3 - (v1 only)| 18.x, 20.x  | 16.x    | `npm i nekosapi@0.3.3 -E` |


### [Documentation](https://nekosapi.com/docs/libraries/javascript)

### [Source code](https://github.com/cataclym/nekosapi)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3IJV8A)
