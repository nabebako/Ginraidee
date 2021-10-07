const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'public_user',
    port: 5432,
    password: 'test',
    database: 'main',
});

async function execute() {
    try {
        await client.connect();
        console.log(`Connected to database ${client['database']} as ${client['user']}.`);
        await client.query('BEGIN');
        var results = await client.query('SELECT name, href, rating FROM MENU ORDER BY rating DESC LIMIT 6');
        console.log(results.rows);
        await client.query('COMMIT');
    }
    catch (ex) {
        console.log(`Failed to excute, ${ex}.`);
        await client.query('ROLLBACK');
    }

    finally {
        await client.end();
    }
}

execute();