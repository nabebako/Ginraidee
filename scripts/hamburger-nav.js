function HAMBURGER_NAV_INIT()
{
    const HAMBURGER_NAV = document.getElementById('h-nav');
    let isOpen = false;

    HAMBURGER_NAV.addEventListener('click', () => 
    {
        if(!isOpen)
        {  
            HAMBURGER_NAV.src = HAMBURGER_NAV.src.replace(/(.*)\/.*$/, '$1/triangle--nav.svg');
            document.getElementById('h-nav-cont').classList.remove('nondisplay');
            isOpen = true;
        } 
        else 
        {
            HAMBURGER_NAV.src = HAMBURGER_NAV.src.replace(/(.*)\/.*$/, '$1/hamburger--nav.svg');
            document.getElementById('h-nav-cont').classList.add('nondisplay');
            isOpen = false;
        }
    });
}

HAMBURGER_NAV_INIT();