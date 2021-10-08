var search_qurey = '';
var query_result = [];

const SQ = document.getElementById('search-query');
const SQ_results = document.getElementById('search-result');

const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'public_user',
    port: 5432,
    password: 'test',
    database: 'main',
});

async function query_database(input) {
    
    console.log(`query: ${query}`);
    var res = [];
    try {
        console.log(`Connected to database ${client['database']} as ${client['user']}.`);
        res = await client.query('SELECT name FROM MENU WHERE name = ($1) ORDER BY rating DESC LIMIT 12', [input]);
        console.log(res.rows);
    }
    catch (err) {
        console.log(`Failed to excute, ${err}.`);
    }

    finally {
        return res;
    }
}

function display_result(res) {
    try {
        res.map((elem) => {
            var div = document.createElement('div');
            var title = document.createElement('p');
            var discpt = document.createElement('p');
            var img = document.createElement('img');

            title.appendChild(document.createTextNode(elem.name));
            discpt.appendChild(document.createTextNode(elem.discription));
            if (/index.html/.test(document.URL)) { img.src = `./resources/menu/${elem.name.toLowerCase().replaceAll(' ', '-')}`; }
            else { img.src = `../resources/menu/${elem.name.toLowerCase().replaceAll(' ', '-')}`; }

            div.appendChild(title);
            div.appendChild(discpt);
            div.appendChild(img);
            document.getElementById('search-result').appendChild(div);
        });
    }
    catch (err) {
        console.log(`Something went wrong: ${err}.`)
    }
    finally {
        return;
    }
}

// get the query from the url
if(/search.html/.test(document.URL)) {
    window.onload = () => { 
        query_result = query_database(document.URL.split('?')[1].split('&').filter(query => /query/.test(query))[0].split('=')[1].replace('-',' '));


    }
}

SQ.addEventListener('input', (qurey) => {
    search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
    query_result = query_database(search_qurey);
});

// For passing query to another page, when user press enter //
SQ.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        search_qurey = search_qurey.replace(/\s/g,'-');
        if(/index.html/.test(window.location.href)) {
            window.location.assign('./pages/search.html?query=' + search_qurey); 
        } 
        else {
            window.location.assign('./search.html?query=' + search_qurey);
        }
    }
});


SQ.addEventListener('focus', () => {
    /* Add the search results */

    SQ_results.classList.remove('hidden');
});

SQ.addEventListener('blur', () => {
    /* Remove search results */
    
    SQ_results.classList.add('hidden');
});