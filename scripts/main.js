var search_qurey = '';
let hamburger_nav_is_open = false;

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
        document.getElementById('pop-up--foreground').style.display = 'none';
        document.getElementById('pop-up--background').style.display = 'none';
        document.body.classList.remove('stop--scroll');
        console.log('Windown Destroyed');
    });
    
    var hamburger_nav = document.getElementById('hamburger--nav');
    hamburger_nav.addEventListener('click', () => {
        if(!hamburger_nav_is_open)
        {
            hamburger_nav.src = 'resources/SVG/triangle--nav.svg';
            document.getElementById('ham--nav--contents').classList.remove('hidden');
            hamburger_nav_is_open = true;
        } 
        else
        {
            hamburger_nav.src = 'resources/SVG/hamburger--nav.svg';
            document.getElementById('ham--nav--contents').classList.add('hidden');
            hamburger_nav_is_open = false;
        }
    });
}


