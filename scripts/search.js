function SEARCH_INIT()
{
    const SEARCH_QUERY  = document.getElementById('search-query');
    const SEARCH_RESULT = document.getElementById('search-result');

    function clearResult() { while (SEARCH_RESULT.firstChild) { SEARCH_RESULT.removeChild(SEARCH_RESULT.lastChild); }}

    function updateResult(res)
    {
        clearResult();

        res.map((elem) =>
        {
            const Link          = document.createElement('a');
            const TextWrapper   = document.createElement('div');
            const Name          = document.createElement('p');
            const Description   = document.createElement('p');
            const Image         = document.createElement('img');

            Link                .classList.add('search-res-link');
            TextWrapper         .classList.add('res-text-wrapper');
            Name                .classList.add('search-res-name');
            Description         .classList.add('search-res-desc');
            Image               .classList.add('search-res-img');

            Link                .href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
            Image               .src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;

            Name                .appendChild(document.createTextNode(elem.name));
            Description         .appendChild(document.createTextNode(elem.discription));
            TextWrapper         .appendChild(Name);
            TextWrapper         .appendChild(Description);
            Link                .appendChild(TextWrapper);
            Link                .appendChild(Image);
            SEARCH_RESULT       .appendChild(Link);

            console.log('Search results updated!');
        });
    }

    async function handleSearch(searchStr, returnAmount) 
    {
        if(searchStr == '' || !/[^\s]/.test(searchStr))
        {
            clearResult();
            return;
        }
        
        const XHR = new XMLHttpRequest();
        XHR.onload = () => { updateResult(JSON.parse(XHR.response)); };
        XHR.open('POST', `/search?s=${searchStr.toLowerCase().replace(/[^0-9a-z ]/g, '').replace(/\s/g, '+')}&n=${returnAmount}`);
        XHR.send();
    }

    if(/pages/.test(document.URL))
    {
        document.getElementById('show-search').addEventListener('click', () =>
        {
            document.getElementById('search-field').classList.toggle('nondisplay');
            document.getElementById('search-query').focus();
        });
    }
    else
    {
        const SEARCH_WRAPPER = document.getElementById('search-container');
        var mouseOn = false;

        SEARCH_WRAPPER.addEventListener('mouseenter', () => { mouseOn = true; });
        SEARCH_WRAPPER.addEventListener('mouseleave', () =>
        {
            if(document.activeElement !== SEARCH_QUERY) { SEARCH_RESULT.classList.add('nondisplay'); }
            mouseOn = false;
        });

        SEARCH_QUERY.addEventListener('focus', () => { SEARCH_RESULT.classList.remove('nondisplay'); });
        SEARCH_QUERY.addEventListener('blur', () =>
        {
            if(!mouseOn) { SEARCH_RESULT.classList.add('nondisplay'); }
        });
    }

    let timeStart, 
        inputTimeout,
        resultUpdated = true;

    SEARCH_QUERY.addEventListener('input', (event) =>
    {
        timeStart = Date.now();
        if(resultUpdated)
        {
            inputTimeout = setInterval(() => 
            {
                console.log(`It's running`);
                if(Date.now() - timeStart >= 400 && !resultUpdated) 
                {
                    handleSearch(SEARCH_QUERY.value.toLowerCase().replace(/[^0-9a-z ]/g, ''), 6);
                    clearInterval(inputTimeout);
                    resultUpdated = true;
                }
            }, 100);
        }
        resultUpdated = false;
    });

    SEARCH_QUERY.addEventListener('keypress', (event) => 
    {
        if(event.key === 'Enter' && SEARCH_QUERY.value != '') 
        {
            var searchStr = SEARCH_QUERY.value.toLowerCase().replace(/[^0-9a-z ]/g, '').replace(/\s/g, '+');
            var rel = document.URL.replace(/\/pages\/.*|\/$/, `/pages/search.html?query=${searchStr}`);
            window.location.assign(rel);  // change it later.
        }
    });
}

SEARCH_INIT();