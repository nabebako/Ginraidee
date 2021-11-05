function ACTION_BUTTON_INIT()
{
    function appendToList(input)
    {
        const XHR = new XMLHttpRequest();
        XHR.onload = () =>
        {
            // Tell user that the thing been added to cart
        }
        XHR.open('POST', '', true);
        XHR.send();
        // Get user cookies.
        // Add input to the customer list
        console.log(input);
    }

    document.getElementById('download').addEventListener('click', () =>
    {
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = '../reminder.txt';
        a.download = '';
        a.click();
        a.remove();
    });
    // Dowload the page in print format

    document.getElementById('print').addEventListener('click', () => { window.print(); });
}

ACTION_BUTTON_INIT();