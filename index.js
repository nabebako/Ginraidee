const { Client } = require('pg');

async function search_database(search_str, res_quantity) {

    const client = new Client({
        host: 'localhost',
        user: 'public_user',
        port: 5432,
        password: 'test',
        database: 'main',
    });
    
    var res = [];
    try {
        await client.connect();
        res = await client.query('SELECT name FROM menu WHERE LOWER(name) LIKE ($1) ORDER BY rating DESC LIMIT ($2)', [`%${search_str}%`, res_quantity]);
    }
    catch (err) { console.log(`Failed to excute, ${err}.`); }
    finally {
        client.end();
        return res.rows;
    }
}


const express = require('express');

const app = express();

app.use(express.static('./'));

const host = app.listen(3000, () => {
    console.log('server started!\nListening on port 3000');
});

app.post('/search', async (req, res) => {

    var args = req.url.split('?')[1];

    var search_str = args
    .match(/(?<=s=).*(?=\&)|(?<=s=).*/g)
    .reduce((res, elem) => `${res}${elem}`, '')
    .replace(/\+/g, ' ')
    .toLocaleLowerCase();

    var res_quan = args.match(/(?<=n=).*(?=\&)|(?<=n=).*/)[0];

    var result = await search_database(search_str, res_quan);

    console.log(`Search argument: ${search_str}`);
    console.log('Result form query:');
    console.log(result);

    res.send();
});




/*
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
*/