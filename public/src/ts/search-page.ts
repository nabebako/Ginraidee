function loadPage(res: MenuObject[])
{
    const SEARCH_RESULT = document.getElementById('search-result');
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
        Raiting                     .appendChild(document.createTextNode(elem.raiting.toString()));
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

const searchPageInit = () =>
{
    let searchStr = document.URL
        .split('?')[1]
        .split('&')
        .filter((elem) => /query/.test(elem))[0]
        .split('=')[1]
        .toLowerCase()
        .replace(/[^0-9a-z\+]/g, '');

    const Search = new XMLHttpRequest();
    Search.onload = () => 
    {
        if(Search.status === 200)
        {
            loadPage(JSON.parse(Search.response));
        }
        else if(Search.status === 404)
        {
            const Title                 = document.createElement('p');
            const Description           = document.createElement('p');
            const Image                 = document.createElement('img');
            // Display that there's no result.
        }
        else
        {
            // Throws an error
        }
    }
    Search.open('POST', '/search');
    Search.send(JSON.stringify(
        {
            'searchStr': searchStr,
            'returnAmount': 40
        }));
}

window.addEventListener('load', searchPageInit);