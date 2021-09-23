import * as func from './func.js';

var form_ans = {};

window.onload = () => {
    const close_botton = document.getElementById('window-close');

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => {
        /*Create a pop-up window.*/

        document.body.classList.add('stop--scroll'); /*Stops scrolling*/
        func.fade_in(document.getElementById('pop-up--background'), .3);
        func.fade_in(document.getElementById('pop-up--foreground'), 1);
        console.log('Window Created');
    });

    close_botton.addEventListener('click', () => {
        /*Get rid of the pop-up window*/

        func.fade_out(document.getElementById('pop-up--foreground'));
        func.fade_out(document.getElementById('pop-up--background'));
        document.body.classList.remove('stop--scroll');
        console.log('Windown Destroyed');
    });
    
    close_botton.addEventListener('mouseover', () => close_botton.src = 'resources/SVG/cross-green.svg');
    close_botton.addEventListener('mouseleave', () => close_botton.src = 'resources/SVG/cross.svg');

    document.getElementById('submit').addEventListener('click', () => {
        /* Get the tickboxs status */
        form_ans['types_of_foods'] = Array.from(document.querySelectorAll('#form input')).filter((query) => query.checked).map((query) => query.value);
        
        console.log(form_ans);
    });
};