const net = require('net');
const {Buffer} = require('buffer');

const host = 'localhost';
const port = 5432;
const user = 'admin';
const db = 'mydb';
const password = 'admin';


const conOptions = {
    host: host,
    port: port,
};

const client = net.createConnection(conOptions, () => {
    console.log(`\nConnected to Postgres DB on ... \nhost: ${conOptions.host}\nport: ${conOptions.port}`);
    console.log(`\nSending startup message to Postgres DB...`);
    client.write(startUpMessage(user, db));
});

client.on('data', (data) => {
    
    switch (String.fromCharCode(data[0])) {
        case 'R':
            console.log("\nAuthentication request received");
            console.log(data);
            let identifierBuffer = Buffer.from('p');
            let lengthBuffer = Buffer.alloc(4);
            let saslBuffer = Buffer.from('SCRAM-SHA-256', 'utf-8');
            lengthBuffer.writeInt32BE(identifierBuffer.length + saslBuffer.length);
            let initialResponse = Buffer.concat([identifierBuffer, lengthBuffer, saslBuffer]);
            client.write(initialResponse);
            break;
        default:
            console.log("\nUnknown message type");
            console.log(data.toString());
            break;
    }
    // client.end();
});

client.on('end', () => {
    console.log('\nDisconnected from server');
});


function startUpMessage(user, database) {

    // Creates a buffer where first 32 bits are the length of message
        // next 32 bits represent the version (split between major and minor) of the protocol we will use
        // next set of bits represent the key value of user and database with a terminating null byte between
        // and a double null byte at the end of the message to signify end of message

    // TODO: Refactor

    const majorVersion = 3;
    const minorVersion = 0;

    const int32Size = Int32Array.BYTES_PER_ELEMENT; // 4 bytes
    const int16Size = Int16Array.BYTES_PER_ELEMENT; // 2 bytes

    let majorVersionBuffer = Buffer.alloc(int16Size);
    majorVersionBuffer.writeInt16BE(majorVersion, 0);

    let minorVersionBuffer = Buffer.alloc(int16Size);
    minorVersionBuffer.writeInt16BE(minorVersion, 0);

    let versionBuffer = Buffer.concat([majorVersionBuffer, minorVersionBuffer]);

    let userBuffer = Buffer.from(`user\0${user}\0`, 'utf-8');
    let dbBuffer = Buffer.from(`database\0${database}\0\0`, 'utf-8');
    let paramsBuffer = Buffer.concat([userBuffer, dbBuffer]);

    let lengthBuffer = Buffer.alloc(int32Size);
    lengthBuffer.writeInt32BE(lengthBuffer.length + versionBuffer.length + paramsBuffer.length);

    let startMessage = Buffer.concat([lengthBuffer, versionBuffer, paramsBuffer]);

    return startMessage;
}

