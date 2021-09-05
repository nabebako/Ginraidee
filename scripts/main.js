var search_qurey = '';

function fade_in(element) {
    var op = 1;
    
}

function fade_out(element) {

}


window.onload = function() { /*Setting up event listeners*/
    document.getElementById('Search-Query').addEventListener('input', (qurey) => {
        search_qurey = qurey.target.value.replaceAll(/[^0-9a-z ]/ig, '');
        console.log('query: ' + search_qurey);
    });
    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => {
        /*Create a poup window.*/
        document.body.classList.add('stop--scroll'); /*Stops scrolling*/
        document.getElementById('pop-up--foreground').style.display = 'block';
        document.getElementById('pop-up--background').style.display = 'block';
        console.log('Window Created');
    });
    document.getElementById('window--close').addEventListener('click', () => {
        document.getElementById('pop-up--foreground').style.display = 'hidden';
        document.getElementById('pop-up--background').style.display = 'hidden';
        console.log('Windown Destroyed');
    });
}


