const search_field = document.getElementById('search-field');
let mouse_over = false;

document.getElementById('show-search').addEventListener('click', () => {
    search_field.classList.remove('hidden');
    document.getElementById('search-query').focus();
});

search_field.addEventListener('mouseenter', () => mouse_over = true);

search_field.addEventListener('mouseleave', () => {
    if(document.getElementById('search-query') !== document.activeElement) {
        search_field.classList.add('hidden');
    }
    mouse_over = false;
});

document.getElementById('search-query').addEventListener('blur', () => {
    if(!mouse_over) {
        search_field.classList.add('hidden');
    }
});