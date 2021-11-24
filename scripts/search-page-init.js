function SEARCH_PAGE_INIT()
{
    const SEARCH_RESULT = document.getElementById('search-result');
    
    function loadPage(res)
    {
        try
        {
            if(res.length === 0 || !res)
            {
                const Title                 = document.createElement('p');
                const Description           = document.createElement('p');
                const Image                 = document.createElement('img');
                // Display that there's no result.
                return;
            }

            res.map((elem) =>
            {
                const SearchResWrapper      = document.createElement('a');
                const ResHeadderWrapper     = document.createElement('div');
                const Name                  = document.createElement('p');
                const Tags                  = document.createElement('ul');
                const ResBodyWrapper        = document.createElement('div');
                const TopOfBodyContent      = document.createElement('div');
                const Raiting               = document.createElement('p'); // Might change it later.
                const SkillTimeWrapper      = document.createElement('div');
                const CookingSkill          = document.createElement('p');
                const CookingTimeWrapper    = document.createElement('div');
                const CookingTime           = document.createElement('p');
                const CookingTimeIcon       = document.createElement('img');
                const Description           = document.createElement('p');
                const Image                 = document.createElement('img');

                SearchResWrapper            .classList.add('search-res-link');
                ResHeadderWrapper           .classList.add('res-text-wrapper');
                Name                        .classList.add('search-res-name');
                Tags                        .classList.add('tag-list');
                ResBodyWrapper              .classList.add('raiting-and-desc-wrapper');
                TopOfBodyContent            .classList.add('space-content');
                Raiting                     .classList.add('raiting');
                SkillTimeWrapper            .classList.add('cooking-skill-time-wrapper');
                CookingSkill                .classList.add('cooking-skill');
                CookingTimeWrapper          .classList.add('cooking-time-wrapper');
                CookingTime                 .classList.add('cooking-time');
                CookingTimeIcon             .classList.add('cooking-time-icon');
                Description                 .classList.add('search-res-desc');
                Image                       .classList.add('search-res-img');

                SearchResWrapper            .href = elem.name; // chnage it later.
                Image                       .src = ''; // Of course I'll change it later.
                CookingTimeIcon             .src = ''; // Change it...

                elem.tags.map((tag) =>
                {
                    let Tag_wrapper         = document.createElement('li');
                    Tag_wrapper             .appendChild(document.createTextNode(tag));
                    Tags                    .appendChild(Tag_wrapper);
                });

                Name                        .appendChild(document.createTextNode(elem.name));
                Raiting                     .appendChild(document.createTextNode(elem.raiting));
                CookingSkill                .appendChild(document.createTextNode(elem.skill));
                CookingTime                 .appendChild(document.createTextNode(elem.cooking_time));
                Description                 .appendChild(document.createTextNode(elem.description));

                ResHeadderWrapper           .appendChild(Name);
                ResHeadderWrapper           .appendChild(Tags);
                CookingTimeWrapper          .appendChild(CookingTime);
                CookingTimeWrapper          .appendChild(CookingTimeIcon);
                SkillTimeWrapper            .appendChild(CookingSkill);
                SkillTimeWrapper            .appendChild(CookingTime);
                TopOfBodyContent            .appendChild(Raiting);
                TopOfBodyContent            .appendChild(SkillTimeWrapper);
                ResBodyWrapper              .appendChild(TopOfBodyContent);
                ResBodyWrapper              .appendChild(Description);
                SearchResWrapper            .appendChild(ResHeadderWrapper);
                SearchResWrapper            .appendChild(ResBodyWrapper);
                SearchResWrapper            .appendChild(Image);
                SEARCH_RESULT               .appendChild(SearchResWrapper);
            });
        }
        catch(err)
        {
            const XHRErrorLog = new XMLHttpRequest();
            XHRErrorLog.open('POST', '/error', true);
            XHRErrorLog.setRequestHeader('content-type', 'application/json');
            XHRErrorLog.send(`{'Error': '${err}'}`);
            while(SEARCH_RESULT.childNodes.length > 0)
            {
                SEARCH_RESULT.removeChild(SEARCH_RESULT.firstChild);
            }
            // Put up a seach error found
        }
    }

    var searchStr = document.URL
        .split('?')[1]
        .split('&')
        .filter(elem => /query/.test(elem))[0]
        .split('=')[1]
        .toLowerCase()
        .replace(/[^0-9a-z\+]/g, '');

    const XHR = new XMLHttpRequest();
    XHR.onload = loadPage(JSON.parse(XHR.response));
    XHR.open('POST', `/search?s=${searchStr}&n=40`, true);
    XHR.send();
}

SEARCH_PAGE_INIT();