const getTopPicksDishes = () =>
{
    const topPicks = new XMLHttpRequest();
    topPicks.onload = () =>
    {
        JSON.parse(topPicks.response).map((elem: MenuObject, i: number) =>
        {
            const a: HTMLAnchorElement = document.querySelector(`a#top-picks-menu-${i}-link`);
            a.querySelector('p').innerText = elem.name;
            a.querySelector('img').src = `${document.location.origin}/resources/menu/${elem.name.toLowerCase().replace(/\s/g, '-')}.jpg`;
            a.href = `${document.location.origin}/pages/${elem.name.toLowerCase().replace(/\s/g, '-')}.html`;
        });
    };
    topPicks.open('POST', '/topmenus');
    topPicks.send();
}

window.addEventListener('load', getTopPicksDishes);