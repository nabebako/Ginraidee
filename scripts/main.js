var search_qurey = '';


window.onload = function() { /*Setting up event listeners*/
    document.getElementById('Search-Query')
            .addEventListener('input', (qurey) => {
                search_qurey = qurey.target.value;
            });
}


