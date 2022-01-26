const initForm = () =>
{
    const FORM = document.getElementById('form-wrapper');

    const initFormRequest = new XMLHttpRequest();
    initFormRequest.onload = () =>
    {
        if(initFormRequest.status === 200)
        {
            const Res = JSON.parse(initFormRequest.response);
            const { Form } = Res;
            const CurrentForm = Res.CurrentForm.replace('_', '-');
            Object.keys(Form).map((FormNumber) =>
            {
                if(Form[FormNumber])
                {
                    Object.keys(Form[FormNumber]).map((category) =>
                    {
                        let FormElement: HTMLInputElement = document.querySelector(`input#${category}`);
                        FormElement.checked = Form[FormNumber][category];
                    });
                }
            });
            FORM.firstElementChild.classList.add('nondisplay');
            FORM.firstElementChild.removeAttribute('current-form');
            document.getElementById(CurrentForm).classList.remove('nondisplay');
            document.getElementById(CurrentForm).setAttribute('current-form', 'true');
        }
    };
    initFormRequest.open('POST', '/initform');
    initFormRequest.send();
}

function showForm()
{
    document.body.classList.add('stop--scroll');
    document.getElementById('pop-up--background').classList.remove('hidden');
    document.getElementById('pop-up--foreground').classList.remove('hidden');
}

function hideForm()
{
    document.getElementById('pop-up--background').classList.add('hidden');
    document.getElementById('pop-up--foreground').classList.add('hidden');
    document.body.classList.remove('stop--scroll');
}

function submitForm()
{
    let formResponse = {};
    const CurrentForm = document.querySelector('div[current-form = true]');
    CurrentForm.querySelectorAll('input').forEach((elem) => { formResponse[elem.value] = elem.checked; });

    const SubmitForm = new XMLHttpRequest();
    SubmitForm.open('POST', '/submitform');
    SubmitForm.onload = () =>
    {
        if(SubmitForm.status === 200)
        {
            const NextForm = document.querySelector('div[current-form = true] + div');
            if(NextForm)
            {
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
    SubmitForm.send(JSON.stringify({'data': formResponse, 'current-form': CurrentForm.id}));
}

window.addEventListener('load', initForm);