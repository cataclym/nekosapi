# nekosapi
[![npm version](https://badge.fury.io/js/nekosapi.svg)](https://badge.fury.io/js/nekosapi)

### Async wrapper for [Nekos API](https://nekos.nekidev.com/)

```js
const { NekosAPI } = require("nekosapi");

// The constructor accepts a token
const api = new NekosAPI();

// Returns NekosImage object
api.getRandomImage("catgirl")
    .then(image => console.log(image));
```
**Node:**

| nekosapi version | Recommended | Minimum | npm                       |
|------------------| ----------- |---------|---------------------------|
| 0.4.0 and up     | 18.x        | 18.x    | `npm i nekosapi`          |
| 0.3.1 to 0.3.2   | 18.x        | 16.x    | `npm i nekosapi@0.3.2 -E` |


### [Documentation](https://nekosapi.com/docs/libraries/javascript)

### [Source code](https://github.com/cataclym/nekosapi)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3IJV8A)
