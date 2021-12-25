const sumbitElement: HTMLInputElement = document.querySelector('button[name=submit]');
const emailInputElement: HTMLInputElement = document.querySelector('input[name=email]');
const passwordInputElement: HTMLInputElement = document.querySelector('input[name=password]');

function validateEmail(email: string): boolean
{
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

function validatePassword(password: string): boolean
{
    const haveOnlyAcceptedChar = !/[^a-z0-9\[\]\\$&+,:;=?@#|_'<>.^*()%!\-]/i.test(password);
    const haveCapitalChar = /[A-Z]/.test(password);
    const haveSpecialChar = /[\[\]\\$&+,:;=?@#|_'<>.^*()%!\-]/.test(password);
    const haveNumber = /[0-9]/.test(password);
    const isLongEnough = password.length > 6;
    
    return haveOnlyAcceptedChar && haveCapitalChar && haveSpecialChar && haveNumber && isLongEnough;
}


emailInputElement.addEventListener('input', () =>
{
    let isValidEmail = validateEmail(document.querySelector('input[name=email]')['value']);
    if(isValidEmail)
    {
        // Change css
    }
    else
    {
        // Change css
    }
});
passwordInputElement.addEventListener('input', () =>
{
    let isValidPassowrd = validatePassword(document.querySelector('input[name=password]')['value']);
    if(isValidPassowrd)
    {
        // Change css
    }
    else
    {
        // Change css
    }
});


sumbitElement.addEventListener('click', (event) =>
{
    // Get values for account creation.
    const email = emailInputElement.value;
    const password = passwordInputElement.value;

    if(validateEmail(email) && validatePassword(password))
    {
        const createNewAccount = new XMLHttpRequest();
        createNewAccount.onload = () =>
        {
            console.log('Account created.');
            if(createNewAccount.responseText === 'Account created successfully.' && createNewAccount.status === 200)
            {
                // Redirect to another page.
            }
            else if(createNewAccount.responseText === 'Account already exists.' && createNewAccount.status === 200)
            {
                // Alert that account already exists.
            }
            else
            {
                // error
            }

        }
        createNewAccount.open('post', '/signup');
        createNewAccount.setRequestHeader('content-type', 'application/json');
        createNewAccount.send(JSON.stringify({
            'email': email,
            'password': password
        }));
    }
    else
    {
    }
});

var x = [
    'e5oC!845STjMSFoA',
    '??n3Rm8pNTdRFFN&',
    'zq$$X@LX?y53NBzj',
    'BG&oNn6#k9K6ntte',
    'krMrj6tr5CBb8M#L',
    '8LR8hqKmC?GQ@iEK',
    'Y!D3J6#8QNAdhsam'
]