const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'blue_tea',
    database: 'main'
});

async function execute() {
    try {
        await client.connect();
        await client.query("BEGIN");
        let results = await client.query("SELECT * FROM test");
        await client.query("COMMIT");
        console.table(results.rows);
    }
    catch (ex) {
        console.log(`Failed to excute, ${ex}`);
        await client.query("ROLLBACK");
    }

    finally {
        await client.end();
    }
}

execute();