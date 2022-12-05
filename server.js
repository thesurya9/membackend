
let app = require("./express");
const http = require('http');
const PORT = process.env.PORT || 3000;
app = http.createServer(app);

const server = app.listen(3000, () => {
    console.log('process listening ON', PORT);
});
module.exports = server;
