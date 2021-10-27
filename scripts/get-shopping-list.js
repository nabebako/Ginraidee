function GET_SHOPPINT_LIST_INIT()
{
    const Shopping_List = document.getElementById('shopping-list-wrapper');

    function display_cart(res)
    {
        res.map((elem) =>
        {
            const menu_wrapper = document.createElement('div');

            const menu_tickBox = document.createElement('input');
            const menu_label = document.createElement('div');

            const menu_content_wrapper = document.createElement('div');
            const main_content_wrapper = document.createElement('div');
            const menu_img = document.createElement('img');
            const menu_name_ingredients_wrapper = document.createElement('div');
            const menu_name = document.createElement('a');
            const ingredients_list = document.createElement('ul');
            const desc = document.createElement('p');

            const serving_wrapper = document.createElement('div');
            const up_arrow = document.createElement('img');
            const serving_input = document.createElement('input');
            const down_arrow = document.createElement('img');

            const serving_input_mobile = document.createElement('select');

            menu_tickBox.classList.add('menu-tickbox');
            menu_wrapper.classList.add('menu-wrapper');
            menu_label.classList.add('menu-label', 'center-content');
            menu_content_wrapper.classList.add('menu-content-wrapper');
            main_content_wrapper.classList.add('menu-main-content-wrapper');
            menu_img.classList.add('menu-img');
            menu_name.classList.add('menu-name');
            ingredients_list.classList.add('ingredients-list');
            desc.classList.add('desc');

            menu_tickBox.id = elem.name; // chnage it later.
            menu_tickBox.type = 'checkbox';
            menu_tickBox.value = elem.name; // chnage it later.
            menu_tickBox.checked = true;
            menu_img.src = elem.name; // chnage it later.
            menu_name.href = elem.name; // Change it later.
            menu_name.appendChild(document.createTextNode(elem.name)); // Chnage it later
            desc.appendChild(document.createTextNode(elem.description)); // Change it later

            res.ingredients.map((ingredient) => // add a ingrdiesnts column in db
            {
                const link_wrapper = document.createElement('li');
                const ingredient_link = document.createElement('a');

                ingredient_link.classList.add('ingredients-link');

                ingredient_link.appendChild(document.createTextNode(ingredient));
                link_wrapper.appendChild(ingredient_link);
                ingredients_list.appendChild(link_wrapper);
            });

            serving_input.classList.add('serving-input');
            serving_input.type = 'text';
            serving_input.value = '1'; // Chnage it later. Try to pull it from the user db.
            serving_input.setAttribute('onchange', "chnage_count(this, 'user_input')");

            up_arrow.classList.add('serving-input-arrow', 'nonselect', 'clickable');
            up_arrow.src = '../arrow-up.svg'; // Chnage the src to be absolute.
            up_arrow.setAttribute('onclick', "chnage_count(this.parentElement.children['1'], 'add');");

            down_arrow.classList.add('serving-input-arrow', 'nonselect', 'clickable');
            down_arrow.src = '../arrow-down.svg'; // Chnage the src to be absolute.
            down_arrow.setAttribute('onclick', "chnage_count(this.parentElement.children['1'], 'minus');");

            serving_input_mobile.classList.add('serving-input-mobile');
            for(var i = 1; i <= 20; i++)
            {
                const option = document.createElement('option');
                option.value = `${i}`
                option.appendChild(document.createTextNode(`${i}`));
                serving_input_mobile.appendChild(option);
            }

            menu_name_ingredients_wrapper.appendChild(menu_name);
            menu_name_ingredients_wrapper.appendChild(ingredients_list);
            main_content_wrapper.appendChild(menu_img);
            main_content_wrapper.appendChild(menu_name_ingredients_wrapper);
            menu_content_wrapper.appendChild(main_content_wrapper);
            menu_content_wrapper.appendChild(desc);
            menu_label.appendChild(menu_content_wrapper);
            menu_wrapper.appendChild(menu_tickBox);
            menu_wrapper.appendChild(menu_label);
            Shopping_List.appendChild(menu_wrapper);

            serving_wrapper.appendChild(up_arrow);
            serving_wrapper.appendChild(serving_input);
            serving_wrapper.appendChild(down_arrow);
            serving_wrapper.appendChild(serving_input_mobile);
        }); 
    }

    const XHR = new XMLHttpRequest();
    XHR.onload = () =>
    {
        display_cart(XHR.response);
    }
    XHR.open('POST', '../getcart');
    XHR.send();
}

GET_SHOPPINT_LIST_INIT();