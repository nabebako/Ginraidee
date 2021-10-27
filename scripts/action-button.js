function ACTION_BUTTON_INIT()
{
    function append_to_list(input)
    {

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
    }); // Dowload the page in print format

    document.getElementById('print').addEventListener('click', () =>
    {
        window.print();
    }); // Print the page
}

ACTION_BUTTON_INIT();