function top_picks_init() {

    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', () => { 

        var res = JSON.parse(XHR.response);
        window.addEventListener('load', () => {
            res.map((elem, i) => {
                document.getElementById(`top-picks-menu-${i}-name`).innerText = elem.name;
                document.getElementById(`top-picks-menu-${i}-img`).src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
                document.getElementById(`top-picks-menu-${i}-link`).href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
            });
        });
    });

    XHR.open('POST', '/topmenus');
    XHR.send();
}

top_picks_init();