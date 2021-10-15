function back_to_top_init()
{
    const to_top_bnt = document.getElementById('back-to-top-bnt');

    window.onscroll = () =>
    {
        if(document.documentElement.scrollTop > 175 || document.body.scrollTop > 175)  
        { to_top_bnt.setAttribute('shown', 'true'); }
        else { to_top_bnt.setAttribute('shown', 'false'); }
    }

    to_top_bnt.onclick = () => 
    {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }
}

back_to_top_init();