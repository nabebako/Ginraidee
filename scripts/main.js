let hamburger_nav_is_open = false;

function Query_DB(query) {
    //Send query to server.

    //Convert them into a list of obj.
    return []; // a list of obj of some sort.
}

window.onload = function() {

    // Get stuff from the data base.
    var weekly_picks = Query_DB('SELECT * FROM menu');
    //document.getElementById('weekly-pick-1-name').textContent = weekly_picks[0].name;
    //document.getElementById('weekly-pick-1-descr').textContent = weekly_picks[0].description;
    //document.getElementById('weekly-pick-1-img').src = weekly_picks[0].imgRel;
    //
    //document.getElementById('weekly-pick-2-name').textContent = weekly_picks[1].name;
    //document.getElementById('weekly-pick-2-descr').textContent = weekly_picks[1].description;
    //document.getElementById('weekly-pick-2-img').src = weekly_picks[1].imgRel;


    /*Setting up event listeners*/

    var hamburger_nav = document.getElementById('h-nav');
    hamburger_nav.addEventListener('click', () => {
        if(!hamburger_nav_is_open) 
        {
            hamburger_nav.src = 'resources/SVG/triangle--nav.svg';
            document.getElementById('h-nav-cont').classList.remove('hidden');
            hamburger_nav_is_open = true;
        } 
        else 
        {
            hamburger_nav.src = 'resources/SVG/hamburger--nav.svg';
            document.getElementById('h-nav-cont').classList.add('hidden');
            hamburger_nav_is_open = false;
        }
    });
}


