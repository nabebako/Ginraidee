const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'postgres',
    database: 'postgres'
});

client.connect()
.then(() => console.log('connected'))
.catch(e => console.log(e))
.finally(() => client.end());