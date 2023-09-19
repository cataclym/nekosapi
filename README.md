# nekosapi
[![npm version](https://badge.fury.io/js/nekosapi.svg)](https://badge.fury.io/js/nekosapi)

### Async wrapper for [Nekos API](https://nekos.nekidev.com/)

#### Note: If you use nodejs with a version less than 18, then install version v0.3.2. `npm i nekosapi@0.3.2 -E`

```js
const { NekosAPI } = require("nekosapi");

// The constructor accepts a token
const api = new NekosAPI();

// Returns NekosImage object
api.getRandomImage("catgirl")
    .then(image => console.log(image));
```

### [Documentation](https://nekosapi.com/docs/libraries/javascript)

### [Source code](https://github.com/cataclym/nekosapi)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3IJV8A)
