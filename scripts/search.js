{
    var search_qurey = '';

    const SQ = document.getElementById('search-query');
    const Search_res = document.getElementById('search-result');

    async function request_query(search_str) {
        var res = [{name: 'Fluffy Pancake'}];

        //Send http request to server with the search string.

        return res;
    }

    function update_result(res) {
        while (Search_res.firstChild) { Search_res.removeChild(Search_res.lastChild); }

        try {
            res.map((elem) => {
                const div = document.createElement('div');
                const title = document.createElement('p');
                const discpt = document.createElement('p');
                const img = document.createElement('img');

                title.classList.add();
                img.classList.add();

                title.appendChild(document.createTextNode(elem.name));
                discpt.appendChild(document.createTextNode(elem.discription));
                img.src = document.URL.replace(/(?<=ginraidee).*/, `/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`);

                div.appendChild(title);
                div.appendChild(discpt);
                div.appendChild(img);
                Search_res.appendChild(div);
            });
        }
        catch (err) {
            while (Search_res.firstChild) { Search_res.removeChild(Search_res.lastChild); }
            console.log(err);
        }
    }

    // get the query from the url
    window.onload = () => {
        if(/search.html/.test(document.URL)) {
            request_query(document.URL.split('?')[1].split('&').filter(elem => /query/.test(elem))[0].split('=')[1].replace(/\+/g,' '))
            .then(res => update_result(res));
        }
    };

    SQ.addEventListener('input', (event) => {
        // Add a timer to wait for input before updaing the results.

        request_query(event.target.value.replace(/[^0-9a-z ]/ig, ''))
        .then(res => update_result(res));
    });

    // For passing query to another page, when user press enter //
    SQ.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            var search_str = SQ.value.replace(/[^0-9a-z ]/ig, '').replace(/\s/g, '+');
            window.location.assign(document.URL.replace(/(?<=ginraidee).*/, `/pages/search.html?query=${search_str}`));  // change it later.
        }
    });

    SQ.addEventListener('focus', () => {
        /* Add the search results */

        Search_res.classList.remove('hidden');
    });

    SQ.addEventListener('blur', () => {
        /* Remove search results */

        Search_res.classList.add('hidden');
    });
}