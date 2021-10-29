function TO_TOP_INIT()
{
    const TO_TOP_BUTTON = document.getElementById('back-to-top-bnt');

    window.onscroll = () =>
    {
        if(document.documentElement.scrollTop > 175 || document.body.scrollTop > 175)  
        { TO_TOP_BUTTON.classList.remove('hidden'); }
        else { TO_TOP_BUTTON.classList.add('hidden'); }
    }

    TO_TOP_BUTTON.onclick = () => 
    {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

TO_TOP_INIT();