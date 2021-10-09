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


async function query_database(search_str) {
    console.log(`query: ${query}`);
    var res = [];
    try {
        console.log(`Connected to database ${client['database']} as ${client['user']}.`);
        res = await client.query('SELECT name FROM MENU WHERE name = ($1) ORDER BY rating DESC LIMIT 12', [search_str]);
        console.log(res.rows);
    }
    catch (err) {
        console.log(`Failed to excute, ${err}.`);
    }

    finally {
        return res;
    }
}

execute();