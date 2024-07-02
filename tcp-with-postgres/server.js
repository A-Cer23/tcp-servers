const net = require('net');
const {Buffer} = require('buffer');

const host = 'localhost';
const port = 5432;
const user = 'admin';
const db = 'mydb';
const password = 'admin';
const majorVersion = 3;
const minorVersion = 0;

const conOptions = {
    host: host,
    port: port,
};

const int32Size = Int32Array.BYTES_PER_ELEMENT; // 4 bytes
const int16Size = Int16Array.BYTES_PER_ELEMENT; // 2 bytes



let majorVersionBuffer = Buffer.alloc(int16Size);
majorVersionBuffer.writeInt16BE(majorVersion, 0);

let minorVersionBuffer = Buffer.alloc(int16Size);
minorVersionBuffer.writeInt16BE(minorVersion, 0);

let versionBuffer = Buffer.concat([majorVersionBuffer, minorVersionBuffer]);

let userBuffer = Buffer.from(`user\0${user}\0`, 'utf-8');
let dbBuffer = Buffer.from(`database\0${db}\0\0`, 'utf-8');
let params = Buffer.concat([userBuffer, dbBuffer]);

let lengthBuffer = Buffer.alloc(int32Size);
lengthBuffer.writeInt32BE(lengthBuffer.length + versionBuffer.length + params.length, 0);

let startMessage = Buffer.concat([lengthBuffer, versionBuffer, params]);

console.log(startMessage.at(7));
// console.log(startMessage);



const client = net.createConnection(conOptions, () => {
    console.log('connected to server!');
    client.write(startMessage);
});

client.on('data', (data) => {
    console.log('Received: ')
    console.log(data.toString());
    client.end();
});

client.on('end', () => {
    console.log('disconnected from server');
});


function startUpMessage(user, database) {

}

