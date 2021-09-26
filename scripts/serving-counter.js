function ingrident_count(serving_count) {
    console.log(serving_count);

    /* Chnage the value of ingridents*/
    document.getElementById('ingredients');
    return [];
}

const Serving = document.getElementById('serving');
const Serving_mobile = document.getElementById('serving-mobile');

document.getElementById('serving-minus').addEventListener('click', () => {

    if(Serving.value > 1)
    {
        Serving.value--;
        ingrident_count(Serving.value);
    }
});

document.getElementById('serving-add').addEventListener('click', () => {
    
    if(Serving.value < 20)
    {
        Serving.value++;
        ingrident_count(Serving.value);
    }
});

Serving.addEventListener('input', () => {

    if(Serving.value < 0)
    {   
        Serving.value = 1;
    }
    else if(Serving.value > 20)
    {
        Serving.value = 20;
    }
    ingrident_count(Serving.value);
});

Serving_mobile.addEventListener('change', () => {

    ingrident_count(Serving_mobile.value);
});