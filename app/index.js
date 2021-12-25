"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pg_1 = require("pg");
const { jsPDF } = require('jspdf');
const fs = require("fs");
const cookies = require('cookie-parser');
const crypto = require("crypto");
const ClientInfo = {
    host: 'localhost',
    user: 'public_user',
    port: 5432,
    password: 'test',
    database: 'main'
};
function logError(err) { fs.appendFileSync('../log/log.txt', `${err}. Time: ${Date()}\n`, 'utf-8'); }
function validateEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (typeof email !== 'string') {
        return false;
    }
    else {
        return emailRegex.test(email);
    }
}
function validatePassword(password) {
    if (typeof password !== 'string') {
        return false;
    }
    else {
        const haveOnlyAcceptedChar = !/[^a-z0-9\[\]\\$&+,:;=?@#|_'<>.^*()%!\-]/i.test(password);
        const haveCapitalChar = /[A-Z]/.test(password);
        const haveSpecialChar = /[\[\]\\$&+,:;=?@#|_'<>.^*()%!\-]/.test(password);
        const haveNumber = /[0-9]/.test(password);
        const isLongEnough = password.length > 6;
        return haveOnlyAcceptedChar && haveCapitalChar && haveSpecialChar && haveNumber && isLongEnough;
    }
}
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.all('*', async (req, res, next) => {
    let sessionId = req.cookies['sessionId'];
    if (sessionId === undefined || sessionId === '') {
        const client = new pg_1.Client(ClientInfo);
        const newSessionId = crypto.randomUUID();
        const newGuestId = `g-${crypto.randomUUID()}`;
        const newCartId = `c-${crypto.randomUUID()}`;
        fs.appendFileSync('../log/cookie.txt', `${newSessionId}\n`, 'utf-8');
        res.cookie('sessionId', newSessionId, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict'
        });
        res.cookie('cartId', newCartId, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict'
        });
        try {
            await client.connect();
            await client.query('INSERT INTO Session_Id VALUES(($1))', [newSessionId]);
            await client.query('INSERT INTO Cart (Id, Items, Session_Id) VALUES (($1), ($2), ($3))', [newCartId, [], newSessionId]);
            await client.query('INSERT INTO Guest_Account(Id, Session_Id, Cart_Id) VALUES (($1), ($2), ($3))', [newGuestId, newSessionId, newCartId]);
            await client.query('UPDATE Cart SET Guest_Id = ($1) WHERE Id = ($2)', [newGuestId, newCartId]);
        }
        catch (err) {
            logError(err);
        }
        finally {
            client.end();
        }
    }
    next();
});
app.post('/search', async (req, res) => {
    const client = new pg_1.Client(ClientInfo);
    const searchStr = req.body['searchStr'];
    const returnAmount = req.body['returnAmount'];
    if (typeof searchStr === 'string' && typeof returnAmount === 'number') {
        try {
            await client.connect();
            const searchResult = (await client.query('SELECT name FROM menu WHERE LOWER(name) LIKE ($1) ORDER BY rating DESC LIMIT ($2)', [`%${searchStr}%`, returnAmount])).rows;
            if (searchResult.length > 0) {
                res.send(searchResult);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/topmenus', async (req, res) => {
    const client = new pg_1.Client(ClientInfo);
    try {
        await client.connect();
        res.send((await client.query('SELECT name, rating FROM menu ORDER BY rating DESC LIMIT 6')).rows);
    }
    catch (err) {
        res.sendStatus(500);
        logError(err);
    }
    finally {
        client.end();
    }
});
app.post('/signup', async (req, res) => {
    const sessionId = req.cookies['sessionId'];
    const cartId = req.cookies['cartId'];
    const email = req.body['email'];
    const password = req.body['password'];
    if (validateEmail(email) && validatePassword(password)) {
        const client = new pg_1.Client(ClientInfo);
        try {
            await client.connect();
            if ((await client.query('SELECT Email FROM User_Account WHERE Email = ($1)', [email])).rowCount === 0) {
                // The account doesn't already exists.
                const newUserId = `u-${crypto.randomUUID()}`;
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
                const accessToken = crypto.createHash('sha256').update(email).update(Date.now().toString(2)).update(sessionId).digest().toString('hex');
                let newCartId = '';
                cartId ? newCartId = cartId : newCartId = `c-${crypto.randomUUID()}`;
                await client.query('INSERT INTO Cart (Id, items, Session_Id) values (($1), ($2), ($3))', [newCartId, [], sessionId]);
                await client.query('INSERT INTO User_Account(Id, Email, Session_Id, Access_Token, Password, Salt, cart_id) VALUES(($1), ($2), ($3), ($4), ($5), ($6))', [newUserId, email, sessionId, accessToken, hashedPassword, salt, newCartId]);
                await client.query('UPDATE Cart SET User_Id = ($1) WHERE Id = ($2)', [newUserId, newCartId]);
                res.cookie('email', email, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                });
                res.cookie('accessToken', accessToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                });
                res.send('Account created successfully.');
            }
            else {
                res.send('Account already exists.');
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/signin', async (req, res) => {
    // Account for the cart feature.
    const sessionID = req.cookies['sessionId'];
    const email = req.body['email'];
    const password = req.body['password'];
    const isRememberMe = req.body['rememberMe'];
    const client = new pg_1.Client(ClientInfo);
    if (validateEmail(email) && validatePassword(password) && typeof isRememberMe === 'boolean') {
        try {
            await client.connect();
            const userAccount = (await client.query('SELECT * from User_Account WHERE Email = ($1);', [email])).rows[0];
            if (userAccount !== undefined) {
                const hashedbuffer = crypto.scryptSync(password, userAccount['salt'], 64);
                const keybuffer = Buffer.from(password, 'hex');
                if (crypto.timingSafeEqual(hashedbuffer, keybuffer)) {
                    const accessToken = crypto.createHash('sha256').update(email).update(Date.now().toString(2)).update(sessionID).digest().toString('hex');
                    await client.query('UPDATE User_Account SET Access_Token = ($1), Session_Id = ($2) WHERE ID = ($3)', [accessToken, sessionID, userAccount['id']]);
                    res.cookie('email', email, {
                        maxAge: isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 0,
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        sameSite: 'strict',
                    });
                    res.cookie('accessToken', accessToken, {
                        maxAge: isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 0,
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        sameSite: 'strict',
                    });
                    res.send('Signin successfully.');
                }
                else {
                    res.send('Incorrect email or password.');
                }
            }
            else {
                res.send('No account with this email.');
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/initform', async (req, res) => {
    const sessionId = req.cookies['sessionId'];
    const client = new pg_1.Client(ClientInfo);
    try {
        await client.connect();
        const CurrentForm = (await client.query('SELECT Current_Form FROM Form_Responses WHERE Session_Id = ($1) LIMIT 1;', [sessionId])).rows[0];
        const FormRes = (await client.query('SELECT Form_1_Data, Form_2_Data, Form_3_Data FROM Form_Responses WHERE Session_Id = ($1) LIMIT 1;', [sessionId])).rows[0];
        if (CurrentForm && FormRes) {
            res.send({ 'CurrentForm': CurrentForm, 'Form': FormRes });
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        res.sendStatus(500);
        logError(err);
    }
    finally {
        client.end();
    }
});
app.post('/submitform', async (req, res) => {
    const sessionId = req.cookies['sessionId'];
    const accessToken = req.cookies['accessToken'];
    const email = req.cookies['email'];
    const formResponese = req.body['Data'];
    const currentFormId = req.body['CurrentForm'];
    const client = new pg_1.Client(ClientInfo);
    if (typeof formResponese === 'object' && typeof currentFormId === 'string' && typeof formResponese === 'object' && typeof currentFormId === 'string') {
        try {
            await client.connect();
            if ((await client.query('SELECT Session_Id FROM Form_Responses WHERE Session_Id = ($1)', [sessionId])).rowCount === 0) {
                await client.query(`INSERT INTO Form_Responses(Session_Id, Current_Form, ${currentFormId}_Data) VALUES (($1), ($2), ($3))`, [sessionId, currentFormId, formResponese]);
            }
            else {
                await client.query(`UPDATE Form_Responses SET ${currentFormId}_Data = ($1) WHERE Session_Id = ($2)`, [formResponese, sessionId]);
            }
            res.sendStatus(200);
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.get('/cart', async (req, res) => {
    const { sessionId } = req.cookies;
    const client = new pg_1.Client(ClientInfo);
    try {
        await client.connect();
        const Cart = (await client.query('SELECT Cart_Items FROM User_Account WHERE Session_Id = ($1) LIMIT 1', [sessionId])).rows[0]['cart_items'];
        if (Cart) {
            res.send(Cart);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        res.sendStatus(500);
        logError(err);
    }
    finally {
        client.end();
    }
});
app.post('/cart*', async (req, res, next) => {
    const sessionId = req.cookies['sessionId'];
    const cartId = req.cookies['cartId'];
    let cart;
    if (!cartId) {
        const client = new pg_1.Client(ClientInfo);
        await client.connect();
        cart = (await client.query('SELECT Cart_Id FROM User_Account WHERE Email = ($1) and Access_Token = ($2)', [req.cookies['email'], req.cookies['accessToken']])).rows[0];
        if (cart) {
            // for logged in users.
            res.cookie('cartId', cart['id'], {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: 'strict',
            });
        }
        else {
            // For guest user that doesn't have a cart.
            const newCartId = `c-${crypto.randomUUID()}`;
            await client.query('INSERT INTO Cart (Id, Items, Session_Id) VALUES(($1), ($2), ($3))', [newCartId, [], req.cookies['sessionId']]);
            await client.query('UPDATE Guest_Account SET Cart_Id = ($1) WHERE Session_Id = ($2)', [newCartId, sessionId]);
            res.cookie('cartId', newCartId, {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: 'strict',
            });
        }
        await client.end();
        res.sendStatus(400);
    }
    else {
        next();
    }
});
app.post('/cart/get', async (req, res) => {
    /* Send back the items of the cart */
    const sessionId = req.cookies['sessionId'];
    const accessToken = req.cookies['accessToken'];
    const email = req.cookies['email'];
    let userCartIdQueryRes;
    let guestCartIdQueryRes;
    let cart = [];
    const client = new pg_1.Client(ClientInfo);
    try {
        await client.connect();
        userCartIdQueryRes = (await client.query('SELECT Cart_Id FROM User_Account WHERE Access_Token = ($1) AND Email = ($2);', [accessToken, email])).rows[0];
        guestCartIdQueryRes = (await client.query('SELECT Cart_Id FROM Guest_Account WHERE Session_Id = ($1);', [sessionId])).rows[0];
        if (userCartIdQueryRes && guestCartIdQueryRes) {
            // Both the user and guest cart are present.
            let cartQueryRes = await client.query('SELECT Items FROM Cart WHERE Id = ($1) or Id = ($2)', [userCartIdQueryRes['cart_id'], guestCartIdQueryRes['cart_id']]);
            for (let i = 0; i < cartQueryRes.rowCount; i++) {
                cart.push(...(await client.query('select name, rating, ingredients, level from dish where id = any(($1));', [cartQueryRes.rows[i]['items']])).rows);
            }
        }
        else if (userCartIdQueryRes) {
            // User cart present, but guest cart isn't.
            let cartQueryRes = (await client.query('SELECT Items FROM Cart WHERE Id = ($1);', [userCartIdQueryRes['cart_id']]));
            for (let i = 0; i < cartQueryRes.rowCount; i++) {
                cart.push(...(await client.query('select name, rating, ingredients, level from dish where id = any(($1));', [cartQueryRes.rows[i]['items']])).rows);
            }
        }
        else if (guestCartIdQueryRes) {
            // User is a guest and there is a cart.
            let cartQueryRes = (await client.query('SELECT Items FROM Cart WHERE Id = ($1);', [guestCartIdQueryRes['cart_id']]));
            for (let i = 0; i < cartQueryRes.rowCount; i++) {
                cart.push(...(await client.query('select name, rating, ingredients, level from dish where id = any(($1));', [cartQueryRes.rows[i]['items']])).rows);
            }
        }
        else {
            // Creates a new cart for the guest user.
            const newCartId = `c-${crypto.randomUUID()}`;
            await client.query('INSERT INTO Cart (Id, Items, Session_Id) VALUES (($1), ($2), ($3))', [newCartId, [], sessionId]);
            await client.query('UPDATE Guest_Account SET Cart_Id = ($1) WHERE Session_Id = ($2)', [newCartId, sessionId]);
        }
        res.send(cart);
    }
    catch (err) {
        res.sendStatus(500);
        logError(err);
    }
    finally {
        client.end();
    }
});
app.post('/cart/add', async (req, res) => {
    const sessionId = req.cookies['sessionId'];
    const accessToken = req.cookies['accessToken'];
    const email = req.cookies['email'];
    const cartId = req.cookies['cartId'];
    const itemName = req.body['ItemName'];
    const client = new pg_1.Client(ClientInfo);
    if (cartId) {
        try {
            await client.connect();
            const dishQueryRes = (await client.query('SELECT Id FROM Dish WHERE Name = ($1) LIMIT 1', [itemName])).rows[0];
            if (dishQueryRes) {
                await client.query('UPDATE Cart SET Items = ARRAY_APPEND(Items, ($1)) where Id = ($2)', [dishQueryRes['id'], cartId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(400);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/cart/remove', async (req, res) => {
    const { sessionId } = req.cookies;
    const removeItemName = req.body['RemoveItemName'];
    const client = new pg_1.Client(ClientInfo);
    if (typeof removeItemName === 'string') {
        try {
            await client.connect();
            let Cart = (await client.query('SELECT * FROM User_Account WHERE Session_Id = ($1) LIMIT 1', [sessionId])).rows;
            if (Cart.length === 1) {
                delete Cart[removeItemName];
                await client.query('UPDATE User_Account SET Cart_Items = ($1) WHERE Session_Id = ($2)', [Cart, sessionId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/cart/update', async (req, res) => {
    const { sessionId } = req.cookies;
    const newCart = req.body;
    const client = new pg_1.Client(ClientInfo);
    if (typeof newCart === 'object') {
        try {
            await client.connect();
            let cart = (await client.query('SELECT Cart_Items FROM User_Account WHERE Session_Id = ($1) LIMIT 1;', [sessionId])).rows[0]['cart_items'];
            if (cart) {
                newCart.map((item) => {
                    try {
                        cart[item['name']]['serving'] = item['serving'];
                        cart[item['name']]['checked'] = item['checked'];
                    }
                    catch (err) {
                        logError(err);
                    }
                });
                await client.query('UPDATE User_Account SET Cart_Items = ($1) WHERE Session_Id = ($2);', [cart, sessionId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/addcartitem', async (req, res) => {
    const { sessionId } = req.cookies;
    const itemName = req.body['ItemName'];
    const client = new pg_1.Client(ClientInfo);
    if (typeof itemName === 'string') {
        try {
            await client.connect();
            const Item = (await client.query('SELECT Name, Rating, Ingrident, level FROM Menu WHERE Name = ($1) LIMIT 1;', [itemName])).rows[0]; // Change it later
            let cart = (await client.query('SELECT Cart_Items FROM User_Account WHERE Session_Id = ($1) LIMIT 1;', [sessionId])).rows[0]['cart_items'];
            if (cart && Item) {
                cart[itemName] = Item;
                await client.query('UPDATE User_Account SET Cart_Items = ($1) WHERE Session_Id = ($2);', [cart, sessionId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/removecartitem', async (req, res) => {
    const { sessionId } = req.cookies;
    const removeItemName = req.body['RemoveItemName'];
    const client = new pg_1.Client(ClientInfo);
    if (typeof removeItemName === 'string') {
        try {
            await client.connect();
            let Cart = (await client.query('SELECT * FROM User_Account WHERE Session_Id = ($1) LIMIT 1', [sessionId])).rows;
            if (Cart.length === 1) {
                delete Cart[removeItemName];
                await client.query('UPDATE User_Account SET Cart_Items = ($1) WHERE Session_Id = ($2)', [Cart, sessionId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/updateCart', async (req, res) => {
    const { sessionId } = req.cookies;
    const newCart = req.body;
    const client = new pg_1.Client(ClientInfo);
    if (typeof newCart === 'object') {
        try {
            await client.connect();
            let cart = (await client.query('SELECT Cart_Items FROM User_Account WHERE Session_Id = ($1) LIMIT 1;', [sessionId])).rows[0]['cart_items'];
            if (cart) {
                newCart.map((item) => {
                    try {
                        cart[item['name']]['serving'] = item['serving'];
                        cart[item['name']]['checked'] = item['checked'];
                    }
                    catch (err) {
                        logError(err);
                    }
                });
                await client.query('UPDATE User_Account SET Cart_Items = ($1) WHERE Session_Id = ($2);', [cart, sessionId]);
                res.sendStatus(200);
            }
            else {
                res.sendStatus(404);
            }
        }
        catch (err) {
            res.sendStatus(500);
            logError(err);
        }
        finally {
            client.end();
        }
    }
    else {
        res.sendStatus(400);
    }
});
app.post('/error', async (req, res) => {
    res.sendStatus(200);
    const { body } = req;
    Object.keys(body).map((key) => { fs.appendFileSync('../log/log.txt', `${key}: ${body[key]}. Time: ${Date()}\n`, 'utf-8'); });
});
app.get('/', (req, res) => { res.sendFile(__dirname.replace(/\/app.*/, '') + '/public/pages/index.html'); });
app.get('*', (req, res) => {
    // Create a custom for resources
    const rootDir = __dirname.replace(/\/app.*/, '');
    let requestedContent = '';
    if (!/\..*/.test(req.path)) {
        // Requesting for page.
        requestedContent = `${rootDir}/public/pages${req.path}.html`;
        if (fs.existsSync(requestedContent)) {
            res.sendFile(requestedContent);
        }
        else {
            res.status(404).sendFile(`${rootDir}/public/pages/404.html`);
        }
    }
    else {
        // Requesting for other contnets.
        requestedContent = `${rootDir}/public${req.path}`;
        if (fs.existsSync(requestedContent)) {
            res.sendFile(requestedContent);
        }
        else {
            res.sendStatus(404);
            fs.writeFileSync('../log/log.txt', `File for contnet ${requestedContent} doesn't exists.`);
        }
    }
});
app.all('*', async (req, res) => {
    res.sendStatus(404);
    fs.appendFileSync('../log/log.txt', `Path ${req.baseUrl} not found. Time: ${Date()}\n`, 'utf-8');
});
const port = 3000;
app.listen(port, async () => { console.log(`Live on http://localhost:${port}`); });
