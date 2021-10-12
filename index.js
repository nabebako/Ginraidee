const { Client } = require('pg');
const express = require('express');

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

const app = express();

app.get('/index.html', (req, res) => {
    res.send('<script>window.location.assign(`${document.location.origin}`);</script>');
});

app.use(express.static('./'));

app.get('*', (req, res) => {
   res.send('<script>window.location.assign(`${document.location.origin}/404.html`);</script>');
});

app.post('/search', async (req, res) => {

    var result = await search_database(req.query.s, req.query.n);

    console.log(`Search argument: ${req.query.s}`);
    console.log('Result form query:');
    console.log(result);

    res.send(result);
});

app.post('/topmenus', async (req, res) => {

    const client = new Client({
        host: 'localhost',
        user: 'public_user',
        port: 5432,
        password: 'test',
        database: 'main',
    });

    await client.connect();
    var top_menu = await client.query('SELECT name, rating FROM menu ORDER BY rating DESC LIMIT 6');
    await client.end();

    res.send(top_menu.rows);
});

const host = app.listen(3000, () => {
    console.log('server started!\nListening on port 3000');
});