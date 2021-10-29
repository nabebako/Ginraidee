function SEARCH_PAGE_INIT()
{
    const SEARCH_RESULT = document.getElementById('search-result');
    
    function loadPage(res)
    {
        res.map((elem) =>
        {
            const SearchResWrapper      = document.createElement('a');
            const ResNameWrapper        = document.createElement('div');
            const Name                  = document.createElement('p');
            const Tags                  = document.createElement('ul');
            const RaitingDescWrapper    = document.createElement('div');
            const Raiting               = document.createElement('p'); // Might change it later.
            const Description           = document.createElement('p');
            const Image                 = document.createElement('img');

            SearchResWrapper            .classList.add('search-res-link');
            ResNameWrapper              .classList.add('res-text-wrapper');
            Name                        .classList.add('search-res-name');
            Tags                        .classList.add('tag-list');
            RaitingDescWrapper          .classList.add('raiting-and-desc-wrapper');
            Raiting                     .classList.add('raiting');
            Description                 .classList.add('search-res-desc');
            Image                       .classList.add('search-res-img');

            SearchResWrapper            .href = elem.name; // chnage it later.
            Image                       .src = ''; // Of course I'll change it later.

            elem.tags.map((tag) =>
            {
                let Tag_wrapper         = document.createElement('li');
                Tag_wrapper             .appendChild(document.createTextNode(tag));
                Tags                    .appendChild(Tag_wrapper);
            });

            Name                        .appendChild(document.createTextNode(elem.name));
            Raiting                     .appendChild(document.createTextNode(elem.raiting));
            Description                 .appendChild(document.createTextNode(elem.description));
            ResNameWrapper              .appendChild(Name);
            ResNameWrapper              .appendChild(Tags);
            RaitingDescWrapper          .appendChild(Raiting);
            RaitingDescWrapper          .appendChild(Description);
            SearchResWrapper            .appendChild(ResNameWrapper);
            SearchResWrapper            .appendChild(RaitingDescWrapper);
            SearchResWrapper            .appendChild(Image);
            SEARCH_RESULT               .appendChild(SearchResWrapper);
        });
    }

    var searchStr = document.URL
        .split('?')[1]
        .split('&')
        .filter(elem => /query/.test(elem))[0]
        .split('=')[1]
        .toLowerCase()
        .replace(/[^0-9a-z\+]/g, '')

    const XHR = new XMLHttpRequest();
    XHR.onload = () => { loadPage(JSON.parse(XHR.response)); };

    XHR.open('POST', `/search?s=${searchStr}&n=40`);
    XHR.send();
}

SEARCH_PAGE_INIT();