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

function autoSginIn()
{
    const XHR = new XMLHttpRequest();
    XHR.onload = () =>
    {

    }
    XHR.open('POST', '/autologin');
    XHR.send();
}

function chnageCount(target: HTMLInputElement, action: string)
{
    target.value = target.value.replace(/[^0-9]/g , '')
    if(target.value == '')
    {
        target.value = '';
        return;
    }

    let val = parseInt(target.value, 10);
    
    if(action == '') { return; }
    if(action == 'userInput')
    {
        if(val > 20) { target.value = val.toString(10).slice(0, -1); }
        if(val < 0) { target.value = '0'; }
    }
    if(action == 'add' && val < 20) { val++; }
    if(action == 'minus' && val > 0) { val--; }

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
    target.value = val.toString(10);
}