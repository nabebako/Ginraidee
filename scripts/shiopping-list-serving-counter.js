function shiopping_list_serving_counter()
{

}

shiopping_list_serving_counter();

function chnage_count(elem, type)
{
    elem.value = elem.value.replace(/[^0-9]/g , '')
    if(elem.value == '')
    {
        elem.value = '';
        return;
    }

    var val = parseInt(elem.value, 10);
    if(type == '') { return; }
    if(type == 'user_input')
    {
        if(val > 20)
        {
            elem.value = val.toString(10).slice(0, -1);
            // Alert the user.
        }
        if(val < 0) { elem.value = '0'; }
    }
    if(type == 'add' && val < 20) { val++; }
    if(type == 'minus' && val > 0) { val--; }

    if(20 > val && val > 0)
    {
        console.log('return to middle');
        elem.parentElement.children['0'].classList.remove('no-mouse');
        elem.parentElement.children['2'].classList.remove('no-mouse');
        elem.parentElement.children['0'].classList.add('clickable');
        elem.parentElement.children['2'].classList.add('clickable');
    }
    else if(val >= 20)
    {
        console.log('reached the max');
        elem.parentElement.children['0'].classList.remove('clickable');
        elem.parentElement.children['0'].classList.add('no-mouse');
    }
    else if(val <= 0)
    {
        console.log('reached the min');
        elem.parentElement.children['2'].classList.remove('clickable');
        elem.parentElement.children['2'].classList.add('no-mouse');
    }
    elem.value = val.toString(10);
    return;
}