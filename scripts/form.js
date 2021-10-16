function form_init()
{
    var form_ans = {};

    const close_botton = document.getElementById('window-close');

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => 
    {
        document.body.classList.add('stop--scroll');
        document.getElementById('pop-up--background').classList.remove('hidden');
        document.getElementById('pop-up--foreground').classList.remove('hidden');
        console.log('Window Created');
    });

      close_botton.addEventListener('click', () =>
      {
        document.getElementById('pop-up--foreground').classList.add('hidden');
        document.getElementById('pop-up--background').classList.add('hidden');
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