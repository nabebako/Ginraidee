document.getElementById('serving-minus').addEventListener('click', () => {

    if(document.getElementById('serving').value > 1)
    {
        document.getElementById('serving').value--;
    }
});

document.getElementById('serving-add').addEventListener('click', () => {
    
    if(document.getElementById('serving').value < 20)
    {
        document.getElementById('serving').value++;

    }
});

document.getElementById('serving').addEventListener('input', (input) => {

    var val = input.target.value;
    console.log(input.target.value);
    if(val < 0)
    {
        
        document.getElementById('serving').value = 1;
    }
    else if(val > 20)
    {

        document.getElementById('serving').value = 20;
    }

})
