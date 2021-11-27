function TOP_PICKS_MENU_INIT()
{
    const XHR = new XMLHttpRequest();
    XHR.onload = () => 
    {
        var res = JSON.parse(XHR.response);
        res.map((elem, i) =>
        {
            document.getElementById(`top-picks-menu-${i}-name`).innerText = elem.name;
            document.getElementById(`top-picks-menu-${i}-img`).src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
            document.getElementById(`top-picks-menu-${i}-link`).href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
        });
        //var WeeklyPicks = document.querySelectorAll(`div#weekly-picks-${i} > *`);
        //WeeklyPicks[0]
        //WeeklyPicks[1]
        //WeeklyPicks[2]
    };
    XHR.open('POST', '/topmenus');
    XHR.send();
}

TOP_PICKS_MENU_INIT();