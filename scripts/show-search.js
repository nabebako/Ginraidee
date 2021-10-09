{
    const search_field = document.getElementById('search-field');
    
    document.getElementById('show-search').addEventListener('click', () => {
        search_field.classList.toggle('hidden');
        document.getElementById('search-query').focus();
    });
}
