const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'blue_tea',
    database: 'main'
});

client.connect()
.then(() => console.log('connected'))
.then(() => client.query("SELECT * FROM test"))
.then(result => console.table(result.rows))
.catch(e => console.log(e))
.finally(() => client.end());