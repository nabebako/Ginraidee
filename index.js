const express = require('express');
const { Client } = require('pg');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const cookies = require('cookie-parser');
const crypto =  require('crypto');

const ClientInfo = {
    host:       'localhost',
    user:       'public_user',
    port:       5432,
    password:   'test',
    database:   'main',
}

async function searchDatabase(search_str, res_quantity)
{
    const client = new Client(ClientInfo);
    
    var res;
    try
    {
        await client.connect();
        res = await client.query('SELECT name FROM menu WHERE LOWER(name) LIKE ($1) ORDER BY rating DESC LIMIT ($2)', [`%${search_str}%`, res_quantity]);
    }
    catch (err) { console.log(`Failed to excute, ${err}.`); }
    finally 
    {
        client.end();
        return res.rows;
    }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

app.all('*', async (req, res, next) =>
{
    // Setting Session ID
    var { SessionID } = req.cookies;
    console.log(SessionID);
    if(SessionID === undefined || SessionID === '')
    {
        SessionID = crypto.randomUUID();
        fs.appendFile('./cookie.txt', `${SessionID}\n`, 'utf-8', () => {});
        res.cookie('SessionID', SessionID, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict'
        });
        try
        {
            const client = new Client(ClientInfo);
            await client.connect();
            await client.query('INSERT INTO Session_Cookies VALUES(($1))', [SessionID]);
            await client.end();
        }
        catch(err)
        {
            console.log(err);
        }
    }
    next();
});


app.get('/index.html', (req, res) => { res.send('<script>window.location.assign(`${document.location.origin}`);</script>'); });

app.use(express.static('./'));

app.get('*', (req, res) =>  { res.status(404).sendFile('/Users/ken/Documents/GitHub/ginraidee/404.html'); });

app.post('/search', async (req, res) => { res.send(await searchDatabase(req.query.s, req.query.n)); });

app.post('/topmenus', async (req, res) =>
{
    const client = new Client(ClientInfo);

    await client.connect();
    var top_menu = await client.query('SELECT name, rating FROM menu ORDER BY rating DESC LIMIT 6');
    res.send(top_menu.rows);
    await client.end();
});

app.post('/login', async (req, res) =>
{

});

app.post('/initform', async (req, res, next) =>
{
    const client = new Client(ClientInfo);
    try
    {
    await client.connect();
    const checkPoint = await client.query('SELECT Current_Stage, Response_Data FROM Form_Responses WHERE client = ($1) LIMIT 1', [req.cookies.SessionID]);
    console.log(checkPoint);
    if(checkPoint.rowCount === 0) { res.sendStatus(404); }
    else
        {
            res.send(checkPoint); // Find a way to package it.
        }
    }
    catch(err)
    {
        res.sendStatus(500);
        fs.appendFile('./log.txt', `${err}. Time: ${Date()}\n`, 'utf-8', (err) => {});
    }
    finally
    {
        await client.end();
    }
});

app.post('/submitform', async (req, res) =>
{
    const { SessionID } = req.cookies;
    try
    {
        const client = new Client(ClientInfo);
        await client.connect();
        if((await client.query('SELECT * FROM Form_Responses WHERE Client = ($1)', [SessionID])).rowCount === 0)
        {
            await client.query(`INSERT INTO Form_Responses(Client, Current_Form, ${req.body.CurrentForm}_Data) VALUES (($1), ($2), ($3))`, 
            [SessionID, req.body.CurrentForm, req.body.Data]);
        }
        else
        {
            await client.query(`UPDATE Form_Responses SET ${req.body.CurrentForm}_Data = ($1) WHERE client = ($2)`, [req.body.Data, SessionID]);
        }
        //await client.query('INSER INTO form($1) VALUES (($2))', []);
        await client.end();
    }
    catch(err) {
        res.sendStatus(500);
        console.log(err);
    }
    //console.log(req.body);
    res.sendStatus(200);
});

app.post('/error', (req, res) =>
{
    const body = req.body;
    Object.keys(body).map((key) =>
    {
        fs.appendFile('./log.txt', `${key}: ${body[key]}. Time: ${Date()}\n`, 'utf-8', (err) => {});
    });
    res.sendStatus(200);
});

app.all('*', (req, res) =>
{
    fs.appendFile('./log.txt', `Path ${req.baseUrl} not found. Time: ${Date()}\n`, 'utf-8', (err) => {});
    res.sendStatus(404);
});

var port = 3000;

app.listen(port, () =>{});