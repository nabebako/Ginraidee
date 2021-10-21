function form_init()
{
    var form_ans = {};

    const Close_Button = document.getElementById('window-close');
    const Background = document.getElementById('pop-up--background');
    const Foreground = document.getElementById('pop-up--foreground');

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () => 
    {
        document.body.classList.add('stop--scroll');
        Background.classList.remove('hidden');
        Foreground.classList.remove('hidden');
    });

      Close_Button.addEventListener('click', () =>
      {
        Background.classList.add('hidden');
        Foreground.classList.add('hidden');
        document.body.classList.remove('stop--scroll');
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