var search_qurey = '';
let hamburger_nav_is_open = false;

function fade_in(element, max_op) {
    element.classList.remove('hidden');
    var op = 0.1;
    var timer = setInterval(() => {
        if (op >= max_op) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function fade_out(element) {
    var op = element.style.opacity;
    var timer = setInterval(() => {
        if (op <= 0.1) {
            clearInterval(timer);
            element.classList.add('hidden');
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}



window.onload = function() { 
    /*Setting up event listeners*/
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

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => {
        /*Create a pop-up window.*/

        document.body.classList.add('stop--scroll'); /*Stops scrolling*/
        fade_in(document.getElementById('pop-up--background'), .3);
        fade_in(document.getElementById('pop-up--foreground'), 1);
        console.log('Window Created');
    });

    document.getElementById('window--close').addEventListener('click', () => {
        /*Get rid of the pop-up window*/

        fade_out(document.getElementById('pop-up--foreground'));
        fade_out(document.getElementById('pop-up--background'));
        document.body.classList.remove('stop--scroll');
        console.log('Windown Destroyed');
    });
    
    var hamburger_nav = document.getElementById('h-nav');
    hamburger_nav.addEventListener('click', () => {
        if(!hamburger_nav_is_open) 
        {
            hamburger_nav.src = 'resources/SVG/triangle--nav.svg';
            document.getElementById('h-nav-cont').classList.remove('hidden');
            hamburger_nav_is_open = true;
        } else 
        {
            hamburger_nav.src = 'resources/SVG/hamburger--nav.svg';
            document.getElementById('h-nav-cont').classList.add('hidden');
            hamburger_nav_is_open = false;
        }
    });
    document.getElementById('submit').addEventListener('click', () => {
        /* Get the tickboxs status */

        var x = Array.from(document.querySelectorAll('#form input')).reduce((acc, input) => ({...acc, [input.id]: input.checked}) ,{});
        console.log(x);

    });
}


