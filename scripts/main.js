var search_qurey = '';
let hamburger_nav_is_open = false;
var form_ans = {};

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

function Query_DB(query) {
    //Send query to server.

    //Convert them into a list of obj.
    return []; // a list of obj of some sort.
}

window.onload = function() { 

    // Get stuff from the data base.
    var weekly_picks = Query_DB('SELECT * FROM menu');
    //document.getElementById('weekly-pick-1-name').textContent = weekly_picks[0].name;
    //document.getElementById('weekly-pick-1-descr').textContent = weekly_picks[0].description;
    //document.getElementById('weekly-pick-1-img').src = weekly_picks[0].imgRel;
    //
    //document.getElementById('weekly-pick-2-name').textContent = weekly_picks[1].name;
    //document.getElementById('weekly-pick-2-descr').textContent = weekly_picks[1].description;
    //document.getElementById('weekly-pick-2-img').src = weekly_picks[1].imgRel;


    /*Setting up event listeners*/
    const SQ = document.getElementById('Search-Query');
    const SQ_results = document.getElementById('search-result');
    const close_botton = document.getElementById('window-close');

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

    close_botton.addEventListener('click', () => {
        /*Get rid of the pop-up window*/

        fade_out(document.getElementById('pop-up--foreground'));
        fade_out(document.getElementById('pop-up--background'));
        document.body.classList.remove('stop--scroll');
        console.log('Windown Destroyed');
    });
    
    close_botton.addEventListener('mouseover', () => close_botton.src = 'resources/SVG/cross-green.svg');
    close_botton.addEventListener('mouseleave', () => close_botton.src = 'resources/SVG/cross.svg');

    var hamburger_nav = document.getElementById('h-nav');
    hamburger_nav.addEventListener('click', () => {
        if(!hamburger_nav_is_open) 
        {
            hamburger_nav.src = 'resources/SVG/triangle--nav.svg';
            document.getElementById('h-nav-cont').classList.remove('hidden');
            hamburger_nav_is_open = true;
        } 
        else 
        {
            hamburger_nav.src = 'resources/SVG/hamburger--nav.svg';
            document.getElementById('h-nav-cont').classList.add('hidden');
            hamburger_nav_is_open = false;
        }
    });

    document.getElementById('submit').addEventListener('click', () => {
        /* Get the tickboxs status */
        form_ans['types_of_foods'] = Array.from(document.querySelectorAll('#form input')).filter((query) => query.checked).map((query) => query.value);
        
        console.log(form_ans);
    });


}


