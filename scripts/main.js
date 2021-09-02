var search_qurey = '';

window.onload = function() { /*Setting up event listeners*/
    document.getElementById('Search-Query')
            .addEventListener('input', (qurey) => {
                search_qurey = qurey.target.value;
                console.log('query: ' + search_qurey);
            });
    document.getElementById('Questionnaire-pop-up')
            .addEventListener('click', () => {
                console.log('create a window');
            });
}


