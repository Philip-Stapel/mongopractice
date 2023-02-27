"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// we want to separate the creation and starting of the app
const app_1 = require("./app");
(0, app_1.main)()
    .then((app) => {
    app.listen(3000, () => {
        console.log("server is up on port " + 3000);
    });
})
    .catch(console.error);
//# sourceMappingURL=index.js.map