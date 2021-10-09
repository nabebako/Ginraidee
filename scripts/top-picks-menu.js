// Send a query request to the database.

// Throw this string to server


{
    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', (event) => {

    })

    XHR.open('POST', 'https://ginraidee.com/index.js'); // Change the https
    XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' ); // Add the required HTTP header for form data POST requests // I don't know what this is.
    XHR.send('SELECT+name,+href,+rating+FROM+MENU+ORDER+BY+rating+DESC+LIMIT+6');
}

