var search_qurey = '';
var query_result = [];

const SQ = document.getElementById('search-query');
const SQ_results = document.getElementById('search-result');

function query_database() {
    console.log('query: ' + search_qurey);
    return [];
}


window.onload = () => { 
    // get the query from the url
    search_qurey = document.URL.split('?')[1].split('&').filter(query => /query/.test(query))[0].split('=')[1].replace('-',' ');

    query_result = query_database();
}


SQ.addEventListener('input', (qurey) => {
    search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
    
    query_result = query_database();
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