function form_init()
{
    function fade_in(element, max_op)
    {
        element.classList.remove('hidden');
        var op = 0.1;
        var timer = setInterval(() =>
        {
            if (op >= max_op) { clearInterval(timer); }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }

    function fade_out(element)
    {
        var op = element.style.opacity;
        var timer = setInterval(() =>
        {
            if (op <= 0.1)
            {
                clearInterval(timer);
                element.classList.add('hidden');
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 10);
    }

    var form_ans = {};

    const close_botton = document.getElementById('window-close');

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => 
    {
        document.body.classList.add('stop--scroll');
        fade_in(document.getElementById('pop-up--background'), .3);
        fade_in(document.getElementById('pop-up--foreground'), 1);
        console.log('Window Created');
    });

      close_botton.addEventListener('click', () =>
      {
        fade_out(document.getElementById('pop-up--foreground'));
        fade_out(document.getElementById('pop-up--background'));
        document.body.classList.remove('stop--scroll');
        console.log('Windown Destroyed');
    });

    document.getElementById('submit').addEventListener('click', () =>
    {
        form_ans['types_of_foods'] = Array
        .from(document.querySelectorAll('#form input'))
        .filter((query) => query.checked)
        .map((query) => query.value);

        console.log(form_ans);
    });
}

form_init();