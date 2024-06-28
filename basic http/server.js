const net = require('net');

const server = net.createServer((socket) => {

    socket.on('end', () => {
        console.log(`${socket.remoteAddress} disconnected`);
    })

    socket.on('data', (data) => {
        [method, path, data] = parseRequest(data);
        
        switch (path) {
            case '/':
                if (method === 'GET') {
                    response(socket, 200, 'text/html', '<h1>Hello World</h1>');
                }
                break;
            case '/json':
                if (method === 'GET') {
                    response(socket, 200, 'text/json', JSON.stringify({ message: 'Hello World' }));
                }
                break;
            default:
                response(socket, 404, 'text/html', '<h1>404 Not Found</h1>');
        }
    })
})

function response(socket, statusCode, contentType, data) {
    kvStatusCode = {
        200: 'OK',
        404: 'Not Found'
    };
    
    socket.write(`HTTP/1.1 ${statusCode} ${kvStatusCode[statusCode]}\r\nContent-Type: ${contentType}\r\n\r\n`);
    socket.write(`${data}`);
    socket.end();
}

function parseRequest(request) {
    const requestArray = request.toString().split('\r\n\r\n');
    const data = requestArray[1];
    const httpHeaderArray = requestArray[0].split('\r\n');
    const method = httpHeaderArray[0].split(' ')[0];
    const path = httpHeaderArray[0].split(' ')[1];

    return [method, path, data];
}

console.log('Server listening on port 3000');
server.listen(3000);