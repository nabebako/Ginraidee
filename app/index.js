"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pg_1 = require("pg");
const fs = require("fs");
const cookies = require("cookie-parser");
const crypto = require("crypto");
const dbConfig = JSON.parse(fs.readFileSync(`${__dirname.replace(/\/app.*/, '')}/app/client-info.json`).toString());
async function logError(err) {
    const rootDir = __dirname.replace(/\/app.*/, '');
    fs.appendFileSync(`${rootDir}/log/log.txt`, `${err}. time: ${Date()}\n`, 'utf-8');
}
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
// function validateUserTokens(accessToken: string, email: string): boolean
// {
//     let isValid: boolean;
//     if(typeof accessToken !== 'string') { return false; }
//     else
//     {
//         const client = new Client(ClientInfo);
//         try
//         {
//             client.connect()
//             .then(() =>
//             {
//                 client.query('SELECT COUNT(*) FROM "user" WHERE "access_token" = ($1) AND "email" = ($2)', [accessToken, email])
//                 .then((queryResult) => 
//                 {
//                     queryResult.rows[0]['count'] === 1 ? isValid = true : isValid = false;
//                 });
//             });
//         }
//         catch(err)
//         {
//             logError(err);
//             isValid = false;
//         }
//         finally { client.end(); }
//         return isValid;
//     }
// }
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.all('*', async (req, res, next) => {
    // * sends back a session cookie if there is none.
    let sessionId = req.cookies['session-id'];
    if (sessionId === undefined || sessionId === '') {
        const client = new pg_1.Client(dbConfig);
        const newSessionId = crypto.randomUUID();
        const newGuestId = `g-${crypto.randomUUID()}`;
        const newCartId = `c-${crypto.randomUUID()}`;
        const newFormId = `f-${crypto.randomUUID()}`;
        const rootDir = __dirname.replace(/\/app.*/, '');
        fs.appendFileSync(`${rootDir}/log/session-id.txt`, `${newSessionId}\n`, 'utf-8');
        fs.appendFileSync(`${rootDir}/log/guest-id.txt`, `${newGuestId}\n`, 'utf-8');
        fs.appendFileSync(`${rootDir}/log/cart-id.txt`, `${newSessionId}\n`, 'utf-8');
        res.cookie('session-id', newSessionId, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            path: '/',
            sameSite: 'strict'
        });
        client.connect()
            .then(() => {
            return Promise.all([
                client.query('INSERT INTO "session_id" VALUES(($1))', [newSessionId]),
                client.query('INSERT INTO "cart"("cart_id", "items", "session_id") VALUES (($1), ($2), ($3))', [newCartId, [], newSessionId]),
                client.query('INSERT INTO "guest"("guest_id", "session_id", "cart_id") VALUES (($1), ($2), ($3))', [newGuestId, newSessionId, newCartId]),
                client.query('UPDATE "cart" SET "guest_id" = ($1) WHERE "cart_id" = ($2)', [newGuestId, newCartId]),
                client.query('INSERT INTO "form"("form_id", "session_id", "current_form", "guest_id") VALUES (($1), ($2), ($3), ($4))', [newFormId, newSessionId, 'form-1', newGuestId]),
            ]);
        })
            .catch(logError)
            .finally(() => client.end());
    }
    next();
});
app.post('/search', async (req, res) => {
    const client = new pg_1.Client(dbConfig);
    const searchStr = req.body['search-string'];
    if (typeof searchStr === 'string') {
        try {
            await client.connect();
            const searchResult = await client.query('SELECT "name", "description", "cooking_time" AS "cooking-time", "serving", "rating", "ingredients", "level", "tags" FROM "dish" WHERE LOWER("name") LIKE ($1) ORDER BY "rating" DESC', [`%${searchStr}%`]);
            if (searchResult.rowCount > 0) {
                res.send(searchResult.rows);
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
    // ? might change the name of the path.
    // todo: change the query;
    const client = new pg_1.Client(dbConfig);
    try {
        await client.connect();
        res.send((await client.query('SELECT "name", "rating" FROM "dish" ORDER BY "rating" DESC')).rows);
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
    //* creates a new account with the email and password provided
    //* upon a successful account creation, sends back a access token and an email cookie
    const sessionId = req.cookies['session-id'];
    const cartId = req.cookies['cart-id'];
    const email = req.body['email'];
    const password = req.body['password'];
    const isRememberMe = req.body['remember-me'];
    if (validateEmail(email) && validatePassword(password) && typeof isRememberMe === 'boolean') {
        const client = new pg_1.Client(dbConfig);
        try {
            await client.connect();
            if ((await client.query('SELECT COUNT(*) FROM "user" WHERE "email" = ($1)', [email])).rows[0]['count'] === 0) {
                // if account doesn't already exists.
                const newUserId = `u-${crypto.randomUUID()}`;
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex');
                const accessToken = crypto.createHash('sha256').update(email).update(Date.now().toString(2)).update(sessionId).digest().toString('hex');
                let newCartId = '';
                cartId ? newCartId = cartId : newCartId = `c-${crypto.randomUUID()}`;
                const newFormId = `f-${crypto.randomUUID()}`;
                res.cookie('email', email, {
                    maxAge: isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 0,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                });
                res.cookie('access-token', accessToken, {
                    maxAge: isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 0,
                    httpOnly: true,
                    path: '/',
                    secure: true,
                    sameSite: 'strict',
                });
                res.send('Account created successfully.');
                await Promise.all([
                    client.query('INSERT INTO "cart"("cart_id", "items", "session_id") VALUES (($1), ($2), ($3))', [newCartId, [], sessionId]),
                    client.query('INSERT INTO "user"("user_id", "email", "session_id", "access_token", "password", "salt", "cart_id") VALUES(($1), ($2), ($3), ($4), ($5), ($6), ($7))', [newUserId, email, sessionId, accessToken, hashedPassword, salt, newCartId]),
                    client.query('UPDATE "cart" SET "user_id" = ($1) WHERE "cart_id" = ($2)', [newUserId, newCartId]),
                    client.query('INSERT INTO "form"("form_id", "session_id", "current_form", "user_id") VALUES (($1), ($2), ($3), ($4))', [sessionId, newFormId, 'form-1', newUserId])
                ]);
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
    const sessionID = req.cookies['session-id'];
    const email = req.body['email'];
    const password = req.body['password'];
    const isRememberMe = req.body['remember-me'];
    const client = new pg_1.Client(dbConfig);
    if (validateEmail(email) && validatePassword(password) && typeof isRememberMe === 'boolean') {
        try {
            await client.connect();
            const userAccount = (await client.query('SELECT "salt", "user_id" as "user-id" FROM "user" WHERE "email" = ($1) LIMIT 1', [email])).rows[0];
            if (userAccount) {
                const hashedbuffer = crypto.scryptSync(password, userAccount['salt'], 64);
                const keybuffer = Buffer.from(password, 'hex');
                if (crypto.timingSafeEqual(hashedbuffer, keybuffer)) {
                    const newAccessToken = crypto.createHash('sha256').update(email).update(Date.now().toString(2)).update(sessionID).digest().toString('hex');
                    await client.query('UPDATE "user" SET "access_token" = ($1), "session_id" = ($2) WHERE "user_id" = ($3)', [newAccessToken, sessionID, userAccount['user-id']]);
                    res.cookie('email', email, {
                        maxAge: isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 0,
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        sameSite: 'strict',
                    });
                    res.cookie('access-token', newAccessToken, {
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
app.post('/form/init', async (req, res) => {
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const client = new pg_1.Client(dbConfig);
    try {
        await client.connect();
        const userForm = (await client.query('SELECT "form_id" AS "form-id", "current_form" AS "current-form", "form-1", "form-2", "form-3" FROM "form" WHERE "form_id" = (SELECT "form_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1)', [accessToken, email])).rows[0];
        const guestForm = (await client.query('SELECT "form_id" AS "form-id", "current_form" AS "current-form", "form-1", "form-2", "form-3" FROM "form" WHERE "form_id" = (SELECT "form_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0];
        if (userForm) {
            res.send({
                'current-form': userForm['current-form'],
                'form-responese': userForm[userForm['current-form']]
            });
        }
        else if (guestForm) {
            res.send({
                'current-form': guestForm['current-form'],
                'form-responese': guestForm[guestForm['current-form']]
            });
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
app.post('/form/submit', async (req, res) => {
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const currentFormName = req.body['current-form-id'];
    const formResponese = req.body['form-responese'];
    const client = new pg_1.Client(dbConfig);
    if (typeof formResponese === 'object' && typeof currentFormName === 'string') {
        try {
            await client.connect();
            const userForm = (await client.query('SELECT "form_id" AS "form-id" FROM "form" WHERE "form_id" = (SELECT "form_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1)', [accessToken, email])).rows[0];
            const guestForm = (await client.query('SELECT "form_id" AS "form-id" FROM "form" WHERE "form_id" = (SELECT "form_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0];
            if (userForm) {
                switch (currentFormName) {
                    case '1':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-1" = ($2)  WHERE "form_id" = ($3)', ['form-2', formResponese, userForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    case '2':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-2" = ($2)  WHERE "form_id" = ($3)', ['form-3', formResponese, userForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    case '3':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-3" = ($2)  WHERE "form_id" = ($3)', ['form-4', formResponese, userForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    default:
                        res.sendStatus(400);
                }
            }
            else if (guestForm) {
                switch (currentFormName) {
                    case '1':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-1" = ($2)  WHERE "form_id" = ($3)', ['form-2', formResponese, guestForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    case '2':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-2" = ($2)  WHERE "form_id" = ($3)', ['form-3', formResponese, guestForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    case '3':
                        await client.query('UPDATE "form" SET "current_form" = ($1), "form-3" = ($2)  WHERE "form_id" = ($3)', ['form-4', formResponese, guestForm['form-id']]);
                        res.sendStatus(200);
                        break;
                    default:
                        res.sendStatus(400);
                }
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
app.post('/cart*', async (req, res, next) => {
    // * purpose: making sure that all requests to the cart path have a valide cart id.
    // Check for the cart id, if valide do nothing, else sends an error and a cookie with a cart id.
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const cartId = req.cookies['cart-id'];
    if (!cartId) {
        const client = new pg_1.Client(dbConfig);
        await client.connect();
        let cartIdQueryRes = await client.query('SELECT "cart_id" AS "cart-id" FROM "user" WHERE "email" = ($1) AND "access_token" = ($2) LIMIT 1', [email, accessToken]);
        if (cartIdQueryRes.rowCount === 1) {
            // for logged in users.
            res.cookie('cart-id', cartIdQueryRes[0]['cart-id'], {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: 'strict',
            });
        }
        else {
            // For guest user that doesn't have a cart.
            const newCartId = `c-${crypto.randomUUID()}`;
            await client.query('INSERT INTO "cart" ("cart_id", "items", "session_id") VALUES(($1), ($2), ($3))', [newCartId, [], sessionId]);
            await client.query('UPDATE "guest" SET "cart_id" = ($1) WHERE "session_id" = ($2)', [newCartId, sessionId]);
            res.cookie('cart-id', newCartId, {
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
    // * sends back a cart associated with the request's session id and or access token and email.
    // todo -> data format has changed, fix it.
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    let userCartId;
    let guestCartId;
    let cartItems = [];
    const client = new pg_1.Client(dbConfig);
    const generateTable = (carts) => {
        // * solution 4: use anonymous tabe with join in a single query
        // creates the string to be use as a anonymous tabe in the sql query
        return carts
            .reduce((itemList, cart) => [...itemList, ...cart['items']], []) /* Flaten the cart array */
            .reduce((itemList, itemA, indexA, items) => {
            // merge duplicates
            if (itemA === undefined) {
                return itemList;
            }
            else {
                return [...itemList, {
                        'dish-id': itemA['dish-id'],
                        'is-checked': itemA['is-checked'],
                        'serving-amount': items.reduce((servingAmount, itemB, indexB) => {
                            // tally up the serving amount for every duplicates
                            if (itemA['dish-id'] === itemB['dish-id'] && indexA !== indexB) {
                                servingAmount += itemB['serving-amount'];
                                items[indexB] = undefined;
                                return servingAmount;
                            }
                            else {
                                return servingAmount;
                            }
                        }, itemA['serving-amount'])
                    }];
            }
        }, [])
            .map((item) => `('${item['dish-id']}', ${item['is-checked']}, ${item['serving-amount']})`) // template for the anonymous table
            .toString();
    };
    try {
        await client.connect();
        userCartId = (await client.query('SELECT "cart_id" AS "cart-id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2)', [accessToken, email])).rows[0];
        guestCartId = (await client.query('SELECT "cart_id" AS "cart-id" FROM "guest" WHERE "session_id" = ($1)', [sessionId])).rows[0];
        if (userCartId && guestCartId) {
            // Both the user and guest cart are present.
            let carts = (await client.query('SELECT "items" FROM "cart" WHERE "cart_id" = ($1) or "cart_id" = ($2)', [userCartId['cart-id'], guestCartId['cart-id']])).rows;
            res.send((await client.query(`SELECT "dish"."name", "dish"."ingredients", "dish"."description", "arg"."is_checked", "arg"."serving_amount" from "dish" LEFT JOIN (VALUES ${generateTable(carts)}) AS "arg" (dish_id, is_checked, serving_amount) ON "arg"."dish_id" = "dish"."dish_id";`)).rows);
        }
        else if (userCartId) {
            // User cart present, but guest cart isn't.
            let carts = (await client.query('SELECT "items" FROM "cart" WHERE "cart_id" = ($1)', [userCartId['cart-id']])).rows;
            res.send((await client.query(`SELECT "dish"."name", "dish"."ingredients", "dish"."description", "arg"."is_checked", "arg"."serving_amount" from "dish" LEFT JOIN (VALUES ${generateTable(carts)}) AS "arg" (dish_id, is_checked, serving_amount) ON "arg"."dish_id" = "dish"."dish_id";`)).rows);
        }
        else if (guestCartId) {
            // User is a guest and there is a cart.
            let carts = (await client.query('SELECT "items" FROM "cart" WHERE "cart_id" = ($1)', [guestCartId['cart-id']])).rows;
            res.send((await client.query(`SELECT "dish"."name", "dish"."ingredients", "dish"."description", "arg"."is_checked", "arg"."serving_amount" from "dish" LEFT JOIN (VALUES ${generateTable(carts)}) AS "arg" (dish_id, is_checked, serving_amount) ON "arg"."dish_id" = "dish"."dish_id";`)).rows);
        }
        else {
            // Creates a new cart for the guest user.
            const newCartId = `c-${crypto.randomUUID()}`;
            await client.query('INSERT INTO "cart" ("cart_id", "items", "session_id") VALUES (($1), ($2), ($3))', [newCartId, [], sessionId]);
            await client.query('UPDATE "guest" SET "cart_id" = ($1) WHERE "session_id" = ($2)', [newCartId, sessionId]);
            res.send({});
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
app.post('/cart/add', async (req, res) => {
    // * adding 1 new item to the user/guest cart
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const dishId = req.body['dish-id'];
    const servingAmount = req.body['serving-amount'];
    if (typeof dishId === 'number' && typeof servingAmount === 'number') {
        const client = new pg_1.Client(dbConfig);
        try {
            await client.connect();
            const dishCount = (await client.query('SELECT COUNT(*) FROM "dish" WHERE "dish_id" = ($1)', [dishId])).rows[0]['count'];
            if (dishCount === 1) {
                const userCart = (await client.query('SELECT "cart_id" AS "cart-id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2)', [accessToken, email])).rows[0];
                if (userCart) {
                    let cartItems = (await client.query('SELECT "items" FROM "cart" WHERE "cart_id" = ($1)', [userCart['cart-id']])).rows[0]['items'];
                    cartItems.push({
                        'dish-id': dishId,
                        'serving-amount': servingAmount,
                        'is-checked': true,
                    });
                    await client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = ($2)', [cartItems, userCart['cart-id']]);
                }
                else {
                    let cartItems = (await client.query('SELECT "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0]['items'];
                    cartItems.push({
                        'dish-id': dishId,
                        'serving-amount': servingAmount,
                        'is-checked': true,
                    });
                    await client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = (SELECT "cart_id" FROM "guest" WHERE "session_id" = ($2) LIMIT 1)', [cartItems, sessionId]);
                }
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
    // * removing 1 item from the user/guest cart
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const dishId = req.body['dish-id'];
    if (typeof dishId === 'number') {
        const client = new pg_1.Client(dbConfig);
        try {
            await client.connect();
            const userCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1)', [accessToken, email])).rows[0];
            const guestCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0];
            if (userCart) {
                let newCartItems = userCart['items'].reduce((newItemList, item) => {
                    if (item['dish-id'] === dishId) {
                        return newItemList;
                    }
                    else {
                        return [...newItemList, item];
                    }
                }, []);
                res.sendStatus(200);
                await client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = ($2)', [newCartItems, userCart['cart-id']]);
            }
            else if (guestCart) {
                let newCartItems = guestCart['items'].reduce((newItemList, item) => {
                    if (item['dish-id'] === dishId) {
                        return newItemList;
                    }
                    else {
                        return [...newItemList, item];
                    }
                }, []);
                res.sendStatus(200);
                await client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = ($2)', [newCartItems, guestCart['cart-id']]);
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
app.post('/cart/check', async (req, res) => {
    //* Check cart for consistancy before doing other thing
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const cartItems = req.body['cart-items'];
    const client = new pg_1.Client(dbConfig);
    try {
        await client.connect();
        const userCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1)', [accessToken, email])).rows[0];
        const guestCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0];
        if (userCart) {
            const areSameCart = userCart['items'].every((userCartItem) => {
                return cartItems.some((cartItem) => {
                    return userCartItem['dish-id'] === cartItem['dish-id'] && userCartItem['is-checked'] === cartItem['is-checked'] && userCartItem['serving-amount'] === cartItem['serving-amount'];
                });
            });
            areSameCart ? res.sendStatus(200) : res.sendStatus(400);
        }
        else if (guestCart) {
            const areSameCart = guestCart['items'].every((guestCartItem) => {
                return cartItems.some((cartItem) => {
                    return guestCartItem['dish-id'] === cartItem['dish-id'] && guestCartItem['is-checked'] === cartItem['is-checked'] && guestCartItem['serving-amount'] === cartItem['serving-amount'];
                });
            });
            areSameCart ? res.sendStatus(200) : res.sendStatus(400);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        logError(err);
        res.sendStatus(500);
    }
    finally {
        client.end();
    }
});
app.post('/cart/update', async (req, res) => {
    const sessionId = req.cookies['session-id'];
    const accessToken = req.cookies['access-token'];
    const email = req.cookies['email'];
    const itemId = req.body['item-id'];
    const newIsCheck = req.body['is-checked'];
    const newServingAmount = req.body['serving-amount'];
    const client = new pg_1.Client(dbConfig);
    try {
        await client.connect();
        const userCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1)', [accessToken, email])).rows[0];
        const guestCart = (await client.query('SELECT "cart_id", "items" FROM "cart" WHERE "cart_id" = (SELECT "cart_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1)', [sessionId])).rows[0];
        if (userCart) {
            userCart['items'].forEach((item) => {
                if (item['dish-id'] === itemId) {
                    item['is-checked'] = newIsCheck;
                    item['serving-amount'] = newServingAmount;
                }
            });
            client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = ($2)', [userCart['items'], userCart['cart-id']])
                .then(() => { client.end(); });
            res.sendStatus(200);
        }
        else if (guestCart) {
            guestCart['items'].forEach((item) => {
                if (item['dish-id'] === itemId) {
                    item['is-checked'] = newIsCheck;
                    item['serving-amount'] = newServingAmount;
                }
            });
            client.query('UPDATE "cart" SET "items" = ($1) WHERE "cart_id" = ($2)', [guestCart['items'], guestCart['cart-id']])
                .then(() => { client.end(); });
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
            client.end();
        }
    }
    catch (err) {
        res.sendStatus(500);
        logError(err);
        client.end();
    }
});
//* IDK
// app.post('/cart/add', async (req, res) =>
// {
//     // todo: impliment a new way that is compatible with the new data structure.
//     const sessionId: string     = req.cookies['session-id'];
//     const accessToken: string   = req.cookies['access-token'];
//     const email: string         = req.cookies['email'];
//     const dishId: number        = req.body['dish-id'];
//     if(typeof dishId === 'number')
//     {
//         const client = new Client(ClientInfo);
//         try
//         {
//             await client.connect();
//             const userCartId  = (await client.query('SELECT "cart_id" FROM "user" WHERE "access_token" = ($1) AND "email" = ($2) LIMIT 1', [accessToken, email])).rows[0];
//             const guestCartId = (await client.query('SELECT "cart_id" FROM "guest" WHERE "session_id" = ($1) LIMIT 1', [sessionId])).rows[0];
//             if(userCartId)
//             {
//                 client.query('UPDATE "cart" set "items" = ')
//             }
//             let cart = (await client.query('SELECT * FROM "user" WHERE "session_id" = ($1) LIMIT 1', [sessionId])).rows;
//             if("cart".length === 1)
//             {
//                 // todo: impliment a new way that is compatible with the new data structure.
//                 await client.query('UPDATE "user" SET "items" = ($1) WHERE "session_id" = ($2)', ["cart", sessionId]);
//                 res.sendStatus(200);
//             }
//             else { res.sendStatus(404); }
//         }
//         catch(err) { res.sendStatus(500); logError(err); }
//         finally { client.end(); }
//     }
//     else { res.sendStatus(400); }
// });
app.get('/', (req, res) => { res.sendFile(`${__dirname.replace(/\/app.*/, '')}/public/pages/index.html`); });
app.get('*', (req, res) => {
    // Create a custom http get request for different resources
    // * The root directory for pages (html) is the pages folder.
    // * The root directory for resources other than pages (html) is the public folder.
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
            logError(`warning: path "${req.path} does not exist"`);
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
            logError(`warning: path "${req.path}" does not exist`);
        }
    }
});
app.all('*', async (req, res) => {
    // * logs any non-get request that have an invalid path
    res.sendStatus(404);
    logError(`warning: path "${req.path}" does not exist`);
});
// const httpsPort = 443;
const httpPort = 80;
// http.createServer(app).listen(httpPort);
(async () => {
    // * The root directory for pages (html) is the pages folder.
    // * The root directory for resources other than pages (html) is the public folder.
    console.log(`Live on http://localhost:${httpPort}`);
    console.log('The root directory for everything other than htmls is the public folder.');
    console.log('The root directory for resources other than pages (html) is the public folder.');
    // try
    // {
    //     const client = new Client(ClientInfo);
    //     await client.connect();
    //     console.log((await client.query('select * from "($1)" limit 1', ['user'])).rows);
    //     await client.end();
    // }
    // catch(err)
    // {
    //     console.log(err);
    // }
})();
