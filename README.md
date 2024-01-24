## Async wrapper for [Nekos API](https://nekosapi.com/)
[![npm version](https://badge.fury.io/js/nekosapi.svg)](https://badge.fury.io/js/nekosapi)

* Supports NekosAPI [**v1**](https://v1.nekosapi.com/docs) and [**v3**](https://nekosapi.com/docs)
* [Axios](https://axios-http.com/)
* [Proxy support](https://github.com/cataclym/nekosapi/issues/2)

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

### [Source code](https://github.com/cataclym/nekosapi)

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3IJV8A)
