function FORM_INIT()
{
    var formResponse = {};

    const CLOSE_BUTTON  = document.getElementById('window-close');
    const BACKGROUND    = document.getElementById('pop-up--background');
    const FOREGROUND    = document.getElementById('pop-up--foreground');

    document.getElementById('Questionnaire-pop-up').addEventListener('click', () =>
    {
        document.body.classList.add('stop--scroll');
        BACKGROUND.classList.remove('hidden');
        FOREGROUND.classList.remove('hidden');
    });

      CLOSE_BUTTON.addEventListener('click', () =>
      {
        BACKGROUND.classList.add('hidden');
        FOREGROUND.classList.add('hidden');
        document.body.classList.remove('stop--scroll');
    });

    document.getElementById('submit').addEventListener('click', () =>
    {
        formResponse['types_of_foods'] = Array
        .from(document.querySelectorAll('#form input'))
        .filter((query) => query.checked)
        .map((query) => query.value);

        console.log(formResponse);
    });
}

FORM_INIT();