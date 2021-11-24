function SERVING_COUNTER_INIT()
{
    const SERVING_INPUT         = document.getElementById('serving-input');
    const SERVING_INPUT_MOBILE  = document.getElementById('serving-input-mobile');

    function ingridentCount(servingCount) 
    {
        console.log(servingCount);

        /* Chnage the value of ingridents*/
        document.getElementById('ingredients');
        return [];
    }

    document.getElementById('serving-minus').addEventListener('click', () => 
    {
        if(SERVING_INPUT.value > 1)
        {
            SERVING_INPUT.value--;
            ingridentCount(SERVING_INPUT.value);
        }
    });

    document.getElementById('serving-add').addEventListener('click', () => 
    {
        if(SERVING_INPUT.value < 20)
        {
            SERVING_INPUT.value++;
            ingridentCount(SERVING_INPUT.value);
        }
    });

    SERVING_INPUT.addEventListener('input', () => 
    {
        if(SERVING_INPUT.value < 0) { SERVING_INPUT.value = 1; }
        else if(SERVING_INPUT.value > 20) { SERVING_INPUT.value = 20; }
        ingridentCount(SERVING_INPUT.value);
    });

    SERVING_INPUT_MOBILE.addEventListener('change', () => 
    {
        ingridentCount(SERVING_INPUT_MOBILE.value);
    });
}

//SERVING_COUNTER_INIT();