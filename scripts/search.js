var search_qurey = '';

const SQ = document.getElementById('Search-Query');
const SQ_results = document.getElementById('search-result');

SQ.addEventListener('input', (qurey) => {

    search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
    console.log('query: ' + search_qurey);
});


SQ.addEventListener('focus', () => {
    /* Add the search results */

    SQ_results.classList.remove('hidden');
});

SQ.addEventListener('blur', () => {
    /* Remove search results */
    
    SQ_results.classList.add('hidden');
});