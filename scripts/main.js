var search_qurey = '';

window.onload = function() { /*Setting up event listeners*/
    document.getElementById('Search-Query')
            .addEventListener('input', (qurey) => {
                search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
                console.log('query: ' + search_qurey);
            });
    document.getElementById('Questionnaire-pop-up')
            .addEventListener('click', () => {
                /*Create a poup window.*/

                console.log('create a window');
            });
}


