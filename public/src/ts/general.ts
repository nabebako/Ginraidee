function showOnPageScroll(elem: HTMLElement, scrollHeight: number)
{
    window.addEventListener('scroll', () =>
    {
        if(document.documentElement.scrollTop > scrollHeight || document.body.scrollTop > scrollHeight) { elem.classList.remove('hidden'); }
        else { elem.classList.add('hidden'); }
    });
}

function scrollToTop()
{
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

function chnageCount(target: HTMLInputElement, action: string)
{
    target.value = target.value.replace(/[^0-9]/g , '')
    if(target.value == '') { target.value = '0'; return; }

    let val = parseInt(target.value, 10);

    if(action == 'userInput')
    {
        if(val > 20)
        {
            target.value = val.toString(10).slice(0, -1);
            //Prompt to say that no over 20 serving is allowed.
        }
        if(val < 0) { target.value = '0'; }
        if(target.value[0] === '0') { target.value = target.value.substr(1); }
    }
    else if(action == 'add' && val < 20) { val++; target.value = val.toString(10);}
    else if(action == 'minus' && val > 0) { val--; target.value = val.toString(10);}
    else { return; }

    if(20 > val && val > 0)
    {
        target.parentElement.querySelector('[increase=true]').classList.remove('no-mouse');
        target.parentElement.querySelector('[decrease=true]').classList.remove('no-mouse');
        target.parentElement.querySelector('[increase=true]').classList.add('clickable');
        target.parentElement.querySelector('[decrease=true]').classList.add('clickable');
    }
    else if(val >= 20)
    {
        target.parentElement.querySelector('[increase=true]').classList.remove('clickable');
        target.parentElement.querySelector('[increase=true]').classList.add('no-mouse');
    }
    else if(val <= 0)
    {
        target.parentElement.querySelector('[decrease=true]').classList.remove('clickable');
        target.parentElement.querySelector('[decrease=true]').classList.add('no-mouse');
    }
    else{}
}

const hamburgerNavInit = () =>
{
    const HAMBURGER_NAV: HTMLImageElement = document.querySelector('img#h-nav');
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

window.addEventListener('load', hamburgerNavInit);