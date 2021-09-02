var search_qurey = '';


window.onload = function() { /*Setting up event listeners*/
    var search_bar = document.getElementById('Search-Query');
    document.querySelector('input').addEventListener('input',() => {});
    search_bar.addEventListener('input', (qurey) => { 
        search_qurey = qurey.target.value;
        console.log(search_qurey);
    });
}




/*
document.querySelector('input').addEventListener('input', (x) => {
    console.log(x);
})
*/
