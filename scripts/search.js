var search_qurey = '';
var query_result = [];

const SQ = document.getElementById('search-query');
const SQ_results = document.getElementById('search-result');

function query_database(query) {
    console.log('query: ' + query);
    return [];
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