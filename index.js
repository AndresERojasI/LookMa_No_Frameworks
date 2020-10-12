/**
 * Primary file for the API
 */

// Global variables for the server
let port = 3000;
const serverHost = 'http://localhost';

// Dependencies
const http = require('http');
const URL = require('url').URL;

// Respond to all requests with a String
const server = http.createServer((req, res) => {
    // Get the URL and parse it
    const parsedUrl = new URL(req.url, `${serverHost}:${port}`);

    // Get the path from the URL
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'').trim();

    // Get the HTTP method
    const method = req.method.toLowerCase(); // ToLowerCase to get everything consistent

    // Get the query string as an object
    const searchObject = new URLSearchParams(parsedUrl.search);

    // Get the Headers as an object
    const headers = req.headers;

    // Send the response
    res.end("hello World! \n");

    // Log the request URI
    console.log(`
        Request received on path: ${trimmedPath === "" ?
        "[home]": trimmedPath}
        HTTP Method: ${method}.
        SearchString: ${searchObject}
        HTTP Headers: ${JSON.stringify(headers)} 
    `);
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
