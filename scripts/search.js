const SQ = document.getElementById('search-query');
const Search_res = document.getElementById('search-result');

async function request_query(search_str) {

    const XHR = new XMLHttpRequest();
    
    XHR.addEventListener('load', (event) => {
        console.log(event.currentTarget.response);
    });

    XHR.open('POST', `/search?s=${search_str.replace(/[^0-9a-z ]/ig, '').replace(/\s/g, '+')}&n=6`);
    XHR.send();

    //Send http request to server with the search string.
    return;
}

function update_result(res) {
    while (Search_res.firstChild) { Search_res.removeChild(Search_res.lastChild); }

    try {
        res.map((elem) => {
            const div = document.createElement('div');
            const title = document.createElement('p');
            const discpt = document.createElement('p');
            const img = document.createElement('img');

            title.classList.add();
            img.classList.add();

            title.appendChild(document.createTextNode(elem.name));
            discpt.appendChild(document.createTextNode(elem.discription));
            img.src = document.URL.replace(/(?<=ginraidee).*/, `/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`);

            div.appendChild(title);
            div.appendChild(discpt);
            div.appendChild(img);
            Search_res.appendChild(div);
        });
    }
    catch (err) {
        while (Search_res.firstChild) { Search_res.removeChild(Search_res.lastChild); }
        console.log(err);
    }
}

// get the query from the url
window.onload = () => {
    if(/search.html/.test(document.URL)) {
        request_query(document.URL.split('?')[1].split('&').filter(elem => /query/.test(elem))[0].split('=')[1].replace(/\+/g,' '))
        .then(res => update_result(res));
    };
}

let time_start, 
    input_timeout,
    result_updated = true;

SQ.addEventListener('input', (event) => {
    time_start = Date.now();
    if (result_updated) {
        input_timeout = setInterval(() => {
            console.log(`It's running`);
            if (Date.now() - time_start >= 1200 && !result_updated) {
                console.log('updated search result');
                if(SQ.value != '') {
                    request_query(SQ.value.replace(/[^0-9a-z ]/ig, ''))
                    .then(res => update_result(res));
                }
                clearInterval(input_timeout);
                result_updated = true;
            }
        }, 100);
    }
    result_updated = false;
});

SQ.addEventListener('focus', () => {
    Search_res.classList.remove('hidden');
});

SQ.addEventListener('blur', () => {
    Search_res.classList.add('hidden');
});

SQ.addEventListener('keypress', (event) => {
    if(event.key === 'Enter' && SQ.value != '') {
        var search_str = SQ.value.replace(/[^0-9a-z ]/ig, '').replace(/\s/g, '+');
        window.location.assign(document.URL.replace(/\/pages\/.*|index.html/, `/pages/search.html?query=${search_str}`));  // change it later.
    }
});
