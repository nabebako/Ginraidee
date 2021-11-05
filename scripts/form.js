function FORM_INIT()
{
    const CLOSE_BUTTON  = document.getElementById('window-close');
    const BACKGROUND    = document.getElementById('pop-up--background');
    const FOREGROUND    = document.getElementById('pop-up--foreground');
    const FORM          = document.getElementById('form-wrapper');
    const SUBMIT        = document.getElementById('submit');

    const XHR = new XMLHttpRequest();
    XHR.onload = () =>
    {
        if(XHR.status === 200)
        {
            // Init stage
            FORM.firstElementChild.classList.add('nondisplay');
            FORM.firstElementChild.removeAttribute('current-form');
            FORM.children[XHR.response.section].classList.remove('nondisplay');
            FORM.children[XHR.response.section].setAttribute('current-form', 'true');
    
            for(let i = 1; i <= FORM.childElementCount; i++)
            {
                document.querySelectorAll(`form-${i} > input`).forEach((elem, i) =>
                {
                    elem.checked = Boolean(XHR.response.data[`form_${i}`][elem.value]);
                });
            }
        }
    }
    XHR.open('POST', '/initform', true);
    XHR.send();

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
        
        // Find the stage somehow

        CurrentForm.querySelectorAll('input').forEach((elem) => { formResponse[elem.value] = elem.checked; });

        console.log(formResponse);

        const XHRCheckCookie = new XMLHttpRequest();
        XHRCheckCookie.onload = () =>
        {
            const SubmitForm = new XMLHttpRequest();
            SubmitForm.open('POST', '/submitform', true);
            SubmitForm.onload = () =>
            {
                if(SubmitForm.status === 200)
                {
                    const NextForm = document.querySelector('div[current-form = true] + div');
                    if(NextForm == null)
                    {
                        CurrentForm.removeAttribute('current-form');
                        FORM.firstElementChild.setAttribute('current-form', 'true');
        
                        // say that form is complete
        
                        CurrentForm.classList.add('nondisplay');
                        // Redirect user to the suggesiton page.
                    }
                    else
                    {
                        // Moving on to the next part of the form.
                        CurrentForm.removeAttribute('current-form');
                        NextForm.setAttribute('current-form', 'true');
        
                        // Find a way to transistion smoothly
                        CurrentForm.classList.add('nondisplay');
                        NextForm.classList.remove('nondisplay');
                    }
                }
                else
                {
                    // Do not procede and tell user to try again
                    window.alert('Someting went wrong. Please try again.');
                }
            }
            SubmitForm.setRequestHeader('content-type', 'application/json');
            SubmitForm.send(JSON.stringify({'Data': formResponse, 'CurrentForm': CurrentForm.id.replace('-', '_')})); // Change null
        }
        XHRCheckCookie.open('POST', '/', true);
        XHRCheckCookie.send();
    });
}

FORM_INIT();