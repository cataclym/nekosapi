const { NekosAPI } = require("./v3/NekosAPI");
const { NekosAPIv1 } = require("./index");

const v3 = new NekosAPI();

const v1 = new NekosAPIv1();

(async () => {
    return Promise.all([v1.getRandomImage(), v3.getRandomImage()]);
})()
    .catch(err => {
        console.log(err)
        process.exit()
    })
    .then(([v1res, v3res]) => {
        if (v1res && v3res) {
            return console.log("Test finished. v1 and v3 image ids:", {
                v1: v1res.id,
                v3: v3res.id,
            })
        }

        else {
            throw new Error(`Test failed. ${v1res ? "v3: " + v3res : "v1: " + v1res}`)
        }
    })