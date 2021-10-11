// Send a query request to the database.

// Throw this string to server

const XHR = new XMLHttpRequest();
var top_picks_menu;

XHR.addEventListener('load', (event) => { // Pick an option.

    // get the server responds and assign it to top_picks_menu //

    top_picks_menu.map((elem, index) => {
        document.getElementById(`top-picks-menu-${index}-name`).innerText = elem.name;
        document.getElementById(`top-picks-menu-${index}-img`).src = document.URL.replace(/(?<=ginraidee).*/, `/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`);
        document.getElementById(`top-picks-menu-${index}-link`).href = document.URL.replace(/(?<=ginraidee).*/, `/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`);
    });

    top_picks_menu.map((elem, index) => {
        let link = document.createElement('a');
        let picture = document.createElement('img');
        let name = document.createElement('p');

        link.classList = 'selection-link overlay-container nondeco-link';
        picture.classList = 'food-img';
        name.classList = 'overlay h-center';

        link.href = document.URL.replace(/(?<=ginraidee).*/, `/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`);
        picture.src = document.URL.replace(/(?<=ginraidee).*/, `/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`);
        name.appendChild(document.createTextNode(elem.name));
        
        link.appendChild(picture);
        link.appendChild(name);
        if (index < 3) {
            document.getElementById('top-picks-menu-container-1').appendChild(link);
        }
        else {
            document.getElementById('top-picks-menu-container-2').appendChild(link);
        }
    });
});

XHR.open('POST', 'https://ginraidee.com/index.js'); // Change the https
XHR.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' ); // Add the required HTTP header for form data POST requests // I don't know what this is.
XHR.send('SELECT+name,+href,+rating+FROM+MENU+ORDER+BY+rating+DESC+LIMIT+6');