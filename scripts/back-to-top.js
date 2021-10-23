function back_to_top_init()
{
    const to_top_bnt = document.getElementById('back-to-top-bnt');

    window.onscroll = () =>
    {
        if(document.documentElement.scrollTop > 175 || document.body.scrollTop > 175)  
        { to_top_bnt.classList.remove('hidden'); }
        else { to_top_bnt.classList.add('hidden'); }
    }

    to_top_bnt.onclick = () => 
    {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

back_to_top_init();