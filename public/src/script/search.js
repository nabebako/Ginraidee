function clearElement(elem) { while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
} }
function updateResult(res) {
    const SearchResult = document.getElementById('search-result');
    clearElement(SearchResult);
    res.map((elem) => {
        const Link = document.createElement('a');
        const TextWrapper = document.createElement('div');
        const Name = document.createElement('p');
        const Description = document.createElement('p');
        const Image = document.createElement('img');
        Link.classList.add('search-res-link');
        TextWrapper.classList.add('res-text-wrapper');
        Name.classList.add('search-res-name');
        Description.classList.add('search-res-desc');
        Image.classList.add('search-res-img');
        Link.href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
        Image.src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
        Name.appendChild(document.createTextNode(elem.name));
        Description.appendChild(document.createTextNode(elem.description));
        TextWrapper.appendChild(Name);
        TextWrapper.appendChild(Description);
        Link.appendChild(TextWrapper);
        Link.appendChild(Image);
        SearchResult.appendChild(Link);
    });
}
/* Use for when enter is pressed to auto redirect to the search result page. */
function redirectToSearchPage(inputElem) {
    let searchStr = inputElem.value.toLowerCase().replace(/[^0-9a-z ]/g, '');
    if (searchStr !== '') {
        window.location.assign(document.URL.replace(/\/pages\/.*|\/$/, `/pages/search.html?query=${searchStr.replace(/\s/g, '+')}`));
    }
}
function showSearchBar() {
    let show = document.getElementById('search-field').classList.toggle('nondisplay');
    if (show) {
        document.getElementById('search-query').focus();
    }
}
function showSearchResult() { document.getElementById('search-result').classList.remove('nondisplay'); }
function hideSearchResult() { document.getElementById('search-result').classList.add('nondisplay'); }
let inputStatus = {
    timeStart: undefined,
    inputTimeout: undefined
};
function addWatchInput(inputElem) {
    inputElem.addEventListener('input', (inputEvent) => {
        inputStatus.timeStart = inputEvent.timeStamp;
        if (inputStatus.inputTimeout === undefined) {
            inputStatus.inputTimeout = setInterval(() => {
                if (Date.now() - inputStatus.timeStart >= 400) {
                    let searchStr = inputElem.value.toLowerCase().replace(/[^0-9a-z\s]/g, '').replace(/\s/g, '+');
                    if (searchStr !== '' && /[0-9a-z]/i.test(searchStr)) {
                        const Search = new XMLHttpRequest();
                        Search.onload = () => updateResult(JSON.parse(Search.response));
                        Search.open('POST', '/search');
                        Search.setRequestHeader('content-type', 'application/json');
                        Search.send(JSON.stringify({
                            'searchStr': searchStr,
                            'returnAmount': 6
                        }));
                    }
                    else {
                        clearElement(document.getElementById('search-result'));
                    }
                    clearInterval(inputStatus.inputTimeout);
                    inputStatus.inputTimeout = undefined;
                }
            }, 100);
        }
    });
    inputElem.addEventListener('keypress', (keypress) => {
        if (keypress.key === 'Enter') {
            redirectToSearchPage(inputElem);
        }
    });
}
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
