function clearElement(elem: HTMLElement) { while (elem.firstChild) { elem.removeChild(elem.lastChild); }}

function refreshSearchResult(dishList: Dish[])
{
    const SEARCH_RESULT = document.getElementById('search-result');
    clearElement(SEARCH_RESULT);

    dishList.map((dish) =>
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

        SearchResWrapper            .href = `http://localhost:3000/menu/${dish.name.toLowerCase().replace(' ', '-')}`;
        Image                       .src = `http://localhost:3000/src/img/menu/${dish.name.toLowerCase().replace(' ', '-')}.png`;
        CookingTimeIcon             .src = 'http://localhost:3000/src/img/cooking-time-icon.png'; // Change it...

        dish.tags.map((tag) =>
        {
            let tagWrapper         = document.createElement('li');
            tagWrapper             .appendChild(document.createTextNode(tag));
            Tags                    .appendChild(tagWrapper);
        });
            
        Name                        .appendChild(document.createTextNode(dish.name));
        Raiting                     .appendChild(document.createTextNode(dish.rating.toString()));
        CookingSkill                .appendChild(document.createTextNode(dish.level));
        CookingTime                 .appendChild(document.createTextNode(dish.cookingTime));
        Description                 .appendChild(document.createTextNode(dish.description));

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


window.addEventListener('load', () =>
{
    const searchInputElem: HTMLInputElement = document.querySelector('input#search-query');
    const searchBarToggle: HTMLImageElement = document.querySelector('#show-search');
    if(document.URL.search('http://localhost:3000/search') !== null)
    {
        const searchString = document.URL.split('?query=')[1];
        if(searchString)
        {
            searchInputElem.value = searchString;
            const search = new XMLHttpRequest();
            search.open('post', '/search');
            search.onload = () =>
            {
                if(search.status === 200)
                {
                    refreshSearchResult(JSON.parse(search.response));
                }
            };
            search.setRequestHeader('content-type', 'application/json');
            search.send(JSON.stringify({'search-string': searchString}));
        }
    }
    // add functionality to the search bar.

    // ? might remove the search delay between key stroke.

    if(searchBarToggle)
    {
        searchBarToggle.addEventListener('click', function ()
        {
            let show = this.classList.toggle('nondisplay');
            if(show) { this.focus(); }
        });
    }

    searchInputElem.addEventListener('keypress', function (keypressEvent)
    {
        // ? chnage it to be time baseed?
        const searchString = this.value;
        if(keypressEvent.key === 'Enter' && searchString !== '')
        {
            if(document.URL.search('http://localhost:3000/search') === 1)
            {
                const search = new XMLHttpRequest();
                search.onload = () =>
                {
                    if(search.status === 200)
                    {
                        refreshSearchResult(JSON.parse(search.response));
                        window.history.pushState({}, '', `?search=${searchString}`);
                    }
                    else if(search.status === 404)
                    {
                        const div = document.createElement('div');
                        const title = document.createElement('p');
                        const err404Img = document.createElement('img');
                        const description = document.createElement('p');

                        title.appendChild(document.createTextNode('Hmm...'));
                        description.appendChild(document.createTextNode(`seems like we coun't find anything related to ${searchString}.`));

                        div.appendChild(title);
                        div.appendChild(err404Img);
                        div.appendChild(description);
                    }
                };
                search.open('post', '/search');
                search.setRequestHeader('content-type', 'text/plain');
                search.send(JSON.stringify({'search-string': searchString}));
            }
            else
            {
                window.location.assign(`http://localhost:3000/search?query=${searchString}`);
            }
        }
    });
});



/* Unused */

// ? use for the serach page

// let inputStatus = {
//     timeStart:  undefined,
//     inputTimeout: undefined
// };

// searchInputElem.addEventListener('input', (inputEvent) =>
// {
//     inputStatus.timeStart = inputEvent.timeStamp;
//     if(inputStatus.inputTimeout === undefined)
//     {
//         inputStatus.inputTimeout = setInterval(() =>
//         {
//             if(Date.now() - inputStatus.timeStart >= 400) 
//             {
//                 let searchStr = searchInputElem.value.toLowerCase().replace(/[^0-9a-z\s]/g, '').replace(/\s/g, '+');
//                 if(searchStr !== '' && /[0-9a-z]/i.test(searchStr))
//                 {
//                     const Search = new XMLHttpRequest();
//                     Search.onload = () => updateResult(JSON.parse(Search.response));
//                     Search.open('POST', '/search');
//                     Search.setRequestHeader('content-type','application/json');
//                     Search.send(JSON.stringify(
//                         {
//                             'searchStr': searchStr,
//                             'returnAmount': 6
//                         }));
//                 }
//                 else { clearElement(document.getElementById('search-result')); }
//                 clearInterval(inputStatus.inputTimeout);
//                 inputStatus.inputTimeout = undefined;
//             }
//         }, 100);
//     }
// });