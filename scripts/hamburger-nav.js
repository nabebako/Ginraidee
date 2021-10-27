function HAMBURGER_NAV_INIT()
{
    var hamburger_nav = document.getElementById('h-nav');

    hamburger_nav.addEventListener('click', () => 
    {
        if(!hamburger_nav_is_open)
        {  
            hamburger_nav.src = hamburger_nav.src.replace(/(.*)\/.*$/, '$1/triangle--nav.svg');
            document.getElementById('h-nav-cont').classList.remove('nondisplay');
            hamburger_nav_is_open = true;
        } 
        else 
        {
            hamburger_nav.src = hamburger_nav.src.replace(/(.*)\/.*$/, '$1/hamburger--nav.svg');
            document.getElementById('h-nav-cont').classList.add('nondisplay');
            hamburger_nav_is_open = false;
        }
    });
}

HAMBURGER_NAV_INIT();