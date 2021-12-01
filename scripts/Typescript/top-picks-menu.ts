function getTopPicksDishes()
{
    const TopPicks = new XMLHttpRequest();
    TopPicks.onload = () =>
    {
        var res: menuObject[] = JSON.parse(TopPicks.response);
        res.map((elem, i) =>
        {
            const a: HTMLAnchorElement = document.querySelector(`a#top-picks-menu-${i}-link`);
            a.querySelector('p').innerText = elem.name;
            a.querySelector('img').src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
            a.href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
        });
    };
    TopPicks.open('POST', '/topmenus');
    TopPicks.send();
}

window.addEventListener('load', () => getTopPicksDishes());