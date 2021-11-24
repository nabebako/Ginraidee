function appendToList(dish: String)
{
        const XHR = new XMLHttpRequest();
        XHR.onload = () =>
        {
            // Tell user that the thing been added to cart
        }
        XHR.open('POST', '');
        XHR.send();
        // Get user cookies.
        // Add input to the customer list
        console.log(dish);
}

function selectAll()
{
    document.querySelectorAll('.menu-tickbox').forEach((elem: HTMLInputElement) =>
    {
        elem.checked = true;
    });
}

function deselectAll()
{
    document.querySelectorAll('.menu-tickbox').forEach((elem: HTMLInputElement) =>
    {
        elem.checked = false;
    });
}

function downloadDish()
{
    // Dowload the page in print format
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = '../reminder.txt';
    a.download = '';
    a.click();
    a.remove();
}

function printDish()
{
    window.print();
}