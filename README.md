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
