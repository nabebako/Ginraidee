function SEARCH_INIT()
{
    const SQ = document.getElementById('search-query');
    const Search_res = document.getElementById('search-result');

    function clear_res() { while (Search_res.firstChild) { Search_res.removeChild(Search_res.lastChild); }}

    function update_result(res) 
    {
        clear_res();

        res.map((elem) => 
        {
            const link = document.createElement('a');
            const text_wrapper = document.createElement('div');
            const name = document.createElement('p');
            const desc = document.createElement('p');
            const img = document.createElement('img');

            link.classList.add('search-res-link');
            text_wrapper.classList.add('res-text-wrapper');
            name.classList.add('search-res-name');
            desc.classList.add('search-res-desc');
            img.classList.add('search-res-img');

            name.appendChild(document.createTextNode(elem.name));
            desc.appendChild(document.createTextNode(elem.discription));

            link.href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
            img.src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;

            text_wrapper.appendChild(name);
            text_wrapper.appendChild(desc);
            link.appendChild(text_wrapper);
            link.appendChild(img);
            Search_res.appendChild(link);

            console.log('Search results updated!');
        });
    }

    async function handle_search(search_str, return_amount) 
    {
        if(search_str == '' || !/[^\s]/.test(search_str)) 
        { clear_res();  return; }
        
        const XHR = new XMLHttpRequest();

        XHR.addEventListener('load', (event) => { update_result(JSON.parse(XHR.response)); });

        XHR.open('POST', `/search?s=${search_str.toLowerCase().replace(/[^0-9a-z ]/g, '').replace(/\s/g, '+')}&n=${return_amount}`);
        XHR.send();
    }

    if(/search.html/.test(document.URL))
    {
        handle_search(document.URL
            .split('?')[1]
            .split('&')
            .filter(elem => /query/.test(elem))[0]
            .split('=')[1]
            .toLowerCase()
            .replace(/[^0-9a-z\+]/g, '')
            .replace(/\+/g,' '), 20);
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
        var mouse_on = false;
        const Search_div = document.getElementById('search-container');

        Search_div.addEventListener('mouseenter', () => { mouse_on = true; });

        Search_div.addEventListener('mouseleave', () => 
        {
            if(document.activeElement !== SQ) { Search_res.classList.add('nondisplay'); }
            mouse_on = false;
        });

        SQ.addEventListener('focus', () => { Search_res.classList.remove('nondisplay'); });

        SQ.addEventListener('blur', () =>
        {
            if(!mouse_on) { Search_res.classList.add('nondisplay'); }
        });
    }

    let time_start, 
        input_timeout,
        result_updated = true;

    SQ.addEventListener('input', (event) =>
    {
        time_start = Date.now();
        if(result_updated) 
        {
            input_timeout = setInterval(() => 
            {
                console.log(`It's running`);
                if(Date.now() - time_start >= 400 && !result_updated) 
                {
                    handle_search(SQ.value.toLowerCase().replace(/[^0-9a-z ]/g, ''), 6);
                    clearInterval(input_timeout);
                    result_updated = true;
                }
            }, 100);
        }
        result_updated = false;
    });

    SQ.addEventListener('keypress', (event) => 
    {
        if(event.key === 'Enter' && SQ.value != '') 
        {
            var search_str = SQ.value.toLowerCase().replace(/[^0-9a-z ]/g, '').replace(/\s/g, '+');
            var rel = document.URL.replace(/\/pages\/.*|\/$/, `/pages/search.html?query=${search_str}`);
            window.location.assign(rel);  // change it later.
        }
    });
}

SEARCH_INIT();