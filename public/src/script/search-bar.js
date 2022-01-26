function clearElement(elem) { while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
} }
function refreshSearchResult(dishList) {
    const SEARCH_RESULT = document.getElementById('search-result');
    clearElement(SEARCH_RESULT);
    dishList.map((dish) => {
        const SearchResWrapper = document.createElement('a');
        const ResHeadderWrapper = document.createElement('div');
        const Name = document.createElement('p');
        const Tags = document.createElement('ul');
        const ResBodyWrapper = document.createElement('div');
        const TopOfBodyContent = document.createElement('div');
        const Raiting = document.createElement('p'); // Might change it later.
        const SkillTimeWrapper = document.createElement('div');
        const CookingSkill = document.createElement('p');
        const CookingTimeWrapper = document.createElement('div');
        const CookingTime = document.createElement('p');
        const CookingTimeIcon = document.createElement('img');
        const Description = document.createElement('p');
        const Image = document.createElement('img');
        SearchResWrapper.classList.add('search-res-link');
        ResHeadderWrapper.classList.add('res-text-wrapper');
        Name.classList.add('search-res-name');
        Tags.classList.add('tag-list');
        ResBodyWrapper.classList.add('raiting-and-desc-wrapper');
        TopOfBodyContent.classList.add('space-content');
        Raiting.classList.add('raiting');
        SkillTimeWrapper.classList.add('cooking-skill-time-wrapper');
        CookingSkill.classList.add('cooking-skill');
        CookingTimeWrapper.classList.add('cooking-time-wrapper');
        CookingTime.classList.add('cooking-time');
        CookingTimeIcon.classList.add('cooking-time-icon');
        Description.classList.add('search-res-desc');
        Image.classList.add('search-res-img');
        SearchResWrapper.href = `http://localhost:3000/menu/${dish.name.toLowerCase().replace(' ', '-')}`;
        Image.src = `http://localhost:3000/src/img/menu/${dish.name.toLowerCase().replace(' ', '-')}.png`;
        CookingTimeIcon.src = 'http://localhost:3000/src/img/cooking-time-icon.png'; // Change it...
        dish.tags.map((tag) => {
            let Tag_wrapper = document.createElement('li');
            Tag_wrapper.appendChild(document.createTextNode(tag));
            Tags.appendChild(Tag_wrapper);
        });
        Name.appendChild(document.createTextNode(dish.name));
        Raiting.appendChild(document.createTextNode(dish.rating.toString()));
        CookingSkill.appendChild(document.createTextNode(dish.level));
        CookingTime.appendChild(document.createTextNode(dish.cookingTime));
        Description.appendChild(document.createTextNode(dish.description));
        ResHeadderWrapper.appendChild(Name);
        ResHeadderWrapper.appendChild(Tags);
        CookingTimeWrapper.appendChild(CookingTime);
        CookingTimeWrapper.appendChild(CookingTimeIcon);
        SkillTimeWrapper.appendChild(CookingSkill);
        SkillTimeWrapper.appendChild(CookingTime);
        TopOfBodyContent.appendChild(Raiting);
        TopOfBodyContent.appendChild(SkillTimeWrapper);
        ResBodyWrapper.appendChild(TopOfBodyContent);
        ResBodyWrapper.appendChild(Description);
        SearchResWrapper.appendChild(ResHeadderWrapper);
        SearchResWrapper.appendChild(ResBodyWrapper);
        SearchResWrapper.appendChild(Image);
        SEARCH_RESULT.appendChild(SearchResWrapper);
    });
}
// const searchPageInit = () =>
// {
//     let searchStr = document.URL
//         .split('?')[1]
//         .split('&')
//         .filter((elem) => /query/.test(elem))[0]
//         .split('=')[1]
//         .toLowerCase()
//         .replace(/[^0-9a-z\+]/g, '');
//     const Search = new XMLHttpRequest();
//     Search.onload = () => 
//     {
//         if(Search.status === 200)
//         {
//             loadPage(JSON.parse(Search.response));
//         }
//         else if(Search.status === 404)
//         {
//             const Title                 = document.createElement('p');
//             const Description           = document.createElement('p');
//             const Image                 = document.createElement('img');
//             // Display that there's no result.
//         }
//         else
//         {
//             // Throws an error
//         }
//     }
//     Search.open('POST', '/search');
//     Search.send(JSON.stringify(
//         {
//             'searchStr': searchStr,
//             'returnAmount': 40
//         }));
// }
// window.addEventListener('load', searchPageInit);
// function updateResult(res: MenuObject[])
// {
//     const SearchResult = document.getElementById('search-result');
//     clearElement(SearchResult);
//     res.map((elem) =>
//     {
//         const Link          = document.createElement('a');
//         const TextWrapper   = document.createElement('div');
//         const Name          = document.createElement('p');
//         const Description   = document.createElement('p');
//         const Image         = document.createElement('img');
//         Link                .classList.add('search-res-link');
//         TextWrapper         .classList.add('res-text-wrapper');
//         Name                .classList.add('search-res-name');
//         Description         .classList.add('search-res-desc');
//         Image               .classList.add('search-res-img');
//         Link                .href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
//         Image               .src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
//         Name                .appendChild(document.createTextNode(elem.name));
//         Description         .appendChild(document.createTextNode(elem.description));
//         TextWrapper         .appendChild(Name);
//         TextWrapper         .appendChild(Description);
//         Link                .appendChild(TextWrapper);
//         Link                .appendChild(Image);
//         SearchResult        .appendChild(Link);
//     });
// }
window.addEventListener('load', () => {
    const searchInputElem = document.querySelector('input#search-query');
    const searchBarToggle = document.querySelector('#show-search');
    if (document.URL.search('http://localhost:3000/search') === 1) {
        const searchString = document.URL.split('?query=')[1];
        if (searchString) {
            searchInputElem.value = searchString;
            const search = new XMLHttpRequest();
            search.onload = () => {
                refreshSearchResult(search.response);
            };
            search.open('post', '/search');
            search.setRequestHeader('content-type', 'text/plain');
            search.send(searchString);
        }
    }
    // add functionality to the search bar.
    // ? might remove the search delay between key stroke.
    if (searchBarToggle) {
        searchBarToggle.addEventListener('click', () => {
            let show = this.classList.toggle('nondisplay');
            if (show) {
                this.focus();
            }
        });
    }
    searchInputElem.addEventListener('keypress', (keypressEvent) => {
        // ? chnage it to be time baseed?
        if (keypressEvent.key === 'Enter' && this.value !== '') {
            if (document.URL.search('http://localhost:3000/search') === 1) {
                const search = new XMLHttpRequest();
                search.onload = () => {
                    refreshSearchResult(search.response);
                    window.history.pushState({}, '', `?search=${this.value}`);
                };
                search.open('post', '/search');
                search.setRequestHeader('content-type', 'text/plain');
                search.send(this.value);
            }
            else {
                window.location.assign(`http://localhost:3000/search?query=${this.value}`);
            }
        }
    });
});
/* Unused */
/*
function handleSearch(searchStr: string, returnAmount: number)
{
    if(searchStr == '' || !/[^\s]/.test(searchStr)) { clearElement(document.getElementById('search-result')); }
    else
    {
        const Search = new XMLHttpRequest();
        Search.onload = () => updateResult(JSON.parse(Search.response));
        Search.open('POST', `/search?s=${searchStr.toLowerCase().replace(/[^0-9a-z ]/g, '').replace(/\s/g, '+')}&n=${returnAmount}`);
        Search.send();
    }
}



*/
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
