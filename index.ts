import * as express from 'express';
import { Client } from 'pg';
const { jsPDF } = require('jspdf');
const fs = require('fs');
const cookies = require('cookie-parser');
import * as crypto from 'crypto';

const ClientInfo = {
    host:       'localhost',
    user:       'public_user',
    port:        5432,
    password:   'test',
    database:   'main'
};

function logError(err: Error) { fs.appendFile('./log.txt', `${err}. Time: ${Date()}\n`, 'utf-8', () => {}); }

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

app.all('*', async (req, res, next) =>
{
    // Setting Session ID
    const { SessionID } = req.cookies;
    if(SessionID === undefined || SessionID === '')
    {
        const client = new Client(ClientInfo);
        const NewSessionID = crypto.randomUUID();

        fs.appendFile('./cookie.txt', `${NewSessionID}\n`, 'utf-8', () => {});
        res.cookie('SessionID', NewSessionID, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict'
        });
        try
        {
            await client.connect();
            await client.query('INSERT INTO Session_Cookies VALUES(($1))', [NewSessionID]);
        }
        catch(err) { logError(err); }
        finally { client.end(); }
    }
    next();
});

app.get('/index.html', async (req, res) => { res.send('<script>window.location.assign(`${document.location.origin}`);</script>'); });

app.post('/search', async (req, res) =>
{
    const client = new Client(ClientInfo);
    const { searchStr } = req.body;
    const { returnAmount } = req.body;
    try
    {
        await client.connect();
        const searchResult = (await client.query('SELECT name FROM menu WHERE LOWER(name) LIKE ($1) ORDER BY rating DESC LIMIT ($2)', [`%${searchStr}%`, returnAmount])).rows;
        if(searchResult.length > 0) { res.send(searchResult); }
        else { res.sendStatus(404); }
    }
    catch (err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/topmenus', async (req, res) =>
{
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        res.send((await client.query('SELECT name, rating FROM menu ORDER BY rating DESC LIMIT 6')).rows);
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/signin', async (req, res) =>
{
    const client = new Client(ClientInfo);
    const { SessionID } = req.cookies;
    const { Email } = req.body;
    try
    {
        await client.connect();
        const AccountID = await client.query('SELECT ID FROM User_Accounts WHERE Email = ($1) LIMIT 1', [Email]);
        if(AccountID.rowCount === 0) { res.sendStatus(404); }
        else
        {
            await client.query('UPDATE User_Accounts SET Session_Cookie = ($1) WHERE ID = ($2) AND Email = ($3)', [SessionID, AccountID, Email]);
            res.send(); // Figure out what to send
        }
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally{ client.end(); }
});

app.post('signup', async (req, res) =>
{
    const client = new Client(ClientInfo);
    const { SessionID } = req.cookies;
    const { Email } = req.body;
    try
    {
        await client.connect();
        if((await client.query('SELECT Email FROM User_Accounts WHERE Email = ($1)', [Email])).rowCount === 0)
        {
            const NewAccountID = `UA-${crypto.randomUUID()}`;
            await client.query('INSERT INTO User_Accounts(ID, Email, Session_Cookie) VALUES(($1), ($2), ($3))', [NewAccountID, Email, SessionID]);
            res.send(); // Figure out what to send
        }
        else { res.sendStatus(400); }
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/initform', async (req, res) =>
{
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        const CurrentForm = (await client.query('SELECT Current_Form FROM Form_Responses WHERE client = ($1) LIMIT 1;')).rows[0];
        const FormRes = (await client.query('SELECT Form_1_Data, Form_2_Data, Form_3_Data FROM Form_Responses WHERE client = ($1) LIMIT 1;', [req.cookies.SessionID])).rows[0];
        if(CurrentForm && FormRes) { res.send({'CurrentForm': CurrentForm, 'Form': FormRes}); }
        else { res.sendStatus(404); }
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/submitform', async (req, res) =>
{
    const { SessionID } = req.cookies;
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        if((await client.query('SELECT Client FROM Form_Responses WHERE Client = ($1)', [SessionID])).rowCount === 0)
        {
            await client.query(`INSERT INTO Form_Responses(Client, Current_Form, ${req.body.CurrentForm}_Data) VALUES (($1), ($2), ($3))`, 
            [SessionID, req.body.CurrentForm, req.body.Data]);
        }
        else
        {
            await client.query(`UPDATE Form_Responses SET ${req.body.CurrentForm}_Data = ($1) WHERE client = ($2)`, [req.body.Data, SessionID]);
        }
        res.sendStatus(200);
    }
    catch(err) { res.sendStatus(500); logError(err);}
    finally { client.end(); }
});

app.get('/cart', async (req, res) =>
{
    const { SessionID } = req.cookies;
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        const Cart = (await client.query('SELECT Cart_Items FROM User_accounts WHERE Session_Cookie = ($1) LIMIT 1', [SessionID])).rows[0]['cart_items'];
        if(Cart) { res.send(Cart); }
        else { res.sendStatus(404); }
    }
    catch(err) { res.sendStatus(500); logError(err);}
    finally { client.end(); }
});

app.post('/addcartitem', async (req, res) =>
{
    const { SessionID } = req.cookies;
    const { ItemName } = req.body;
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        const Item = (await client.query('SELECT Name, Rating, Ingrident, level FROM Menu WHERE Name = ($1) LIMIT 1;', [ItemName])).rows[0]; // Change it later
        let cart = (await client.query('SELECT Cart_Items FROM User_accounts WHERE Session_Cookie = ($1) LIMIT 1;', [SessionID])).rows[0]['cart_items'];
        if(cart && Item)
        {
            cart[ItemName] = Item;
            await client.query('UPDATE User_accounts SET Cart_Items = ($1) WHERE Session_Cookie = ($2);', [cart, SessionID]);
            res.sendStatus(200);
        }
        else { res.sendStatus(404); }
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/removecartitem', async (req, res) =>
{
    const { SessionID } = req.cookies;
    const { RemoveItemName } = req.body;
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        let Cart = (await client.query('SELECT * FROM User_accounts WHERE Session_Cookie = ($1) LIMIT 1', [SessionID])).rows;
        if(Cart.length === 1)
        {
            delete Cart[RemoveItemName];
            await client.query('UPDATE User_accounts SET Cart_Items = ($1) WHERE Session_Cookie = ($2)', [Cart, SessionID]);
            res.sendStatus(200);
        }
        else { res.sendStatus(404); }
    }
    catch(err) { res.sendStatus(500); logError(err); }
    finally { client.end(); }
});

app.post('/updateCart', async (req, res) =>
{
    const { SessionID } = req.cookies;
    const NewCart: object[] = req.body;
    const client = new Client(ClientInfo);
    try
    {
        await client.connect();
        let cart = (await client.query('SELECT Cart_Items FROM User_Accounts WHERE Session_Cookie = ($1) LIMIT 1;', [SessionID])).rows[0]['cart_items'];
        if(cart)
        {
            NewCart.map((item) =>
            {
                try
                {
                    cart[item['name']]['serving'] = item['serving'];
                    cart[item['name']]['checked'] = item['checked'];
                }
                catch(err) { logError(err); }
            });
            await client.query('UPDATE User_Accounts SET Cart_Items = ($1) WHERE Session_Cookie = ($2);', [cart, SessionID]);
            res.sendStatus(200);
        }
        else { res.sendStatus(404); }
    }
    catch(err) { res.sendStatus(500); logError(err);}
    finally { client.end(); }
});

app.post('/error', async (req, res) =>
{
    res.sendStatus(200);
    const { body } = req;
    Object.keys(body).map((key) => { fs.appendFile('./log.txt', `${key}: ${body[key]}. Time: ${Date()}\n`, 'utf-8', () => {}); });
});


app.use(express.static('./'));
app.get('*', async (req, res) =>  { res.status(404).sendFile('/Users/ken/Documents/GitHub/ginraidee/404.html'); });
app.all('*', async (req, res) =>
{
    res.sendStatus(404);
    fs.appendFile('./log.txt', `Path ${req.baseUrl} not found. Time: ${Date()}\n`, 'utf-8', () => {});
});

const port = 3000;
app.listen(port, () => console.log(`Live on http://localhost:${port}`));