/**
 * Primary file for the API
 */

// Global variables for the server
let port = 3000;
const serverHost = 'http://localhost';

// Dependencies
const http = require('http');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');

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

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on("data", data => {
        buffer += decoder.write(data);
        console.log('data buffered');
    });

    req.on("end", () => {
        buffer += decoder.end();

        // Choose the handler this request should go to.
        // If not found, return the 404 Not Found handler
        const chosenHandler = trimmedPath in router ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            searchObject,
            method,
            'payload': buffer
        }

        // Route the request to the appropriate handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // use the status code called back by the handler, or  default to 200
            statusCode = statusCode || 200;

            // Use the payload called by the handler, or default to empty object
            payload = payload || {};

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload);

            // return the response
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request URI
            console.log(`
                Request received on path: ${trimmedPath === "" ?
                "[home]": trimmedPath}
                HTTP Method: ${method}.
                SearchString: ${searchObject}
                HTTP Headers: ${JSON.stringify(headers)}
                Payload: ${buffer}
                Status Code: ${statusCode}
                Payload: ${payloadString}
            `);
        });
    });
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

// Define handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
    // Callback an http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Not found Handler (404)
handlers.notFound = (data, callback) => {
    callback(404);
}

// Define a request router
const router = {
    'sample' : handlers.sample
}
