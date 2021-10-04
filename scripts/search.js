var search_qurey = '';

const SQ = document.getElementById('search-query');
const SQ_results = document.getElementById('search-result');

SQ.addEventListener('input', (qurey) => {
    search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
    console.log('query: ' + search_qurey);
});

// For passing query to another page, when user press enter //
SQ.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        search_qurey = search_qurey.replace(/\s/g,'-');
        if(/index.html/.test(window.location.href)) {
            window.location.assign('./pages/shopping-list.html?query=' + search_qurey); 
        } 
        else {
            window.location.assign('./shopping-list.html?query=' + search_qurey);
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