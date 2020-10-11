/**
 * Primary file for the API
 */

// Global variables for the server
let port = 3000;

// Dependencies
const http = require('http');

// Respond to all requests with a String
const server = http.createServer((req, res) => {
    res.end("hello World! \n");
});

// Start the server and Listen on port 3000
server.listen(port, () => {
    console.log(`The server is listening on port ${server.address().port}`);
});


// Handle Server events
server.on("error", e => {
    if(e.code === "EADDRINUSE"){
        console.log("Address already in use, retrying...")
        setTimeout(() => {
            server.close();
            server.listen(++port);
        })
    }
});
