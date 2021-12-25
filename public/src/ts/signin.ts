document.querySelector('div').addEventListener('click', () =>
{
    const email = '123';
    const password = '23';
    const signIntoAccount = new XMLHttpRequest();
    signIntoAccount.onload = () =>
    {
        if(signIntoAccount.status === 200)
        {
            if(signIntoAccount.responseText === 'Signin successfully.')
            {
                // Redirect
            }
            else if(signIntoAccount.responseText === 'Incorrect email or password.')
            {
                
            }
            else if(signIntoAccount.responseText === 'No account with this email.')
            {

            }
            else
            {

            }
        }
    };
    signIntoAccount.open('POST', '/signin');
    signIntoAccount.setRequestHeader('content-type', 'application/json');
    signIntoAccount.send(JSON.stringify({
        'email': email,
        'password': password
    }));
});