function FORM_INIT()
{
    const CLOSE_BUTTON  = document.getElementById('window-close');
    const BACKGROUND    = document.getElementById('pop-up--background');
    const FOREGROUND    = document.getElementById('pop-up--foreground');
    const FORM          = document.getElementById('form-wrapper');
    const SUBMIT        = document.getElementById('submit');

    const InitForm = new XMLHttpRequest();
    InitForm.onload = () =>
    {
        if(InitForm.status === 200)
        {
            const Response = JSON.parse(InitForm.response);
            console.log(Response);
            const ResponseKey = Object.values(Response);
            Object.values(Response).map((formData) => { if(formData) { Object.keys(formData).map((key) =>
                {
                    try { document.getElementById(key).checked = formData[key]; }
                    catch(err) { const Error = new XMLHttpRequest(); Error.open('POST', '/error', true); Error.send(err);
                }});}});

            var currentFormID;
            for(let i = 0; i < ResponseKey.length; i++) { if(ResponseKey[i] === undefined || ResponseKey[i] === null) { currentFormID = `form-${i}`; break; } }

            FORM.firstElementChild.classList.add('nondisplay');
            FORM.firstElementChild.removeAttribute('current-form');
            document.getElementById(currentFormID).classList.remove('nondisplay');
            document.getElementById(currentFormID).setAttribute('current-form', 'true');
        }
    };
    InitForm.open('POST', '/initform', true);
    InitForm.send();

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

    SUBMIT.addEventListener('click', () =>
    {
        let formResponse = {};
        const CurrentForm = document.querySelector('div[current-form = true]');
        CurrentForm.querySelectorAll('input').forEach((elem) => { formResponse[elem.value] = elem.checked; });

        console.log(formResponse);

        const SubmitForm = new XMLHttpRequest();
        SubmitForm.open('POST', '/submitform', true);
        SubmitForm.onload = () =>
        {
            if(SubmitForm.status === 200)
            {
                const NextForm = document.querySelector('div[current-form = true] + div');
                if(NextForm !== null && NextForm !== undefined)
                {
                    // Moving on to the next part of the form.
                    CurrentForm.removeAttribute('current-form');
                    NextForm.setAttribute('current-form', 'true');

                    // Find a way to transistion smoothly
                    CurrentForm.classList.add('nondisplay');
                    NextForm.classList.remove('nondisplay');
                }
                else
                {
                    // say that form is complete
                    // Redirect user to the suggesiton page.
                }
            }
            else
            {
                // Tell the user to send request again
                window.alert('Someting went wrong. Please try again.');
            }
        };
        SubmitForm.setRequestHeader('content-type', 'application/json');
        SubmitForm.send(JSON.stringify({'Data': formResponse, 'CurrentForm': CurrentForm.id.replace('-', '_')})); // Change null
    });
}

FORM_INIT();