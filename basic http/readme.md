
# Basic HTTP Server

This is a basic HTTP server using the Net module from NodeJS

All the file does is creates a TCP server that parses HTTP requests and responds either with an HTML or JSON response

---

## Endpoints

- /
    - GET
        - response = HTML "hello world"
    - Other methods
        - responds with 404
- /json 
    - GET
        - response = JSON {"message": "hello world"}
    - Other methods
        - response = 404 
- /data
    - POST (with data)
        - response = echoed back the data in html
    - POST (no data)
        - reponse = 404    
    - Other methods
        - response = 404 

---

## Running the application

### With Node 22.3.0 or higher
`node server.js`

### With docker
`docker build -t basic-http-server .`\
`docker run --name=basic-http-server --publish 3000:3000 basic-http-server`

After running the server \
You can connect to it through your browser on localhost:3000 \
\
If you want to hit the `/data` endpoint, use an application like Postman to send a POST request with data (body)