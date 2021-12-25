function addToCart(dish: string)
{
    const AddItem = new XMLHttpRequest();
    AddItem.onload = () =>
    {
       if(AddItem.status !== 200)
        {
            window.alert('Somethng went wrong. Try again.');
        }
    }
    AddItem.open('POST', '/addcartitem');
    AddItem.setRequestHeader('content-type', 'application/json');
    AddItem.send(JSON.stringify({'ItemName' : dish }));
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