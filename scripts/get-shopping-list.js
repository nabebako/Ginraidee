function get_shopping_list_init()
{
    const Shopping_List = document.getElementById('shopping-list-wrapper');
    function display_cart(res) 
    {
        res.map((elem) => 
        {
            const wrapper = document.createElement('div');

            const input = document.createElement('input');
            const label = document.createElement('div');
            const content_wrapper = document.createElement('div');
            const main_content_wrapper = document.createElement('div');
            const img = document.createElement('img');
            const main_text_content_wrapper = document.createElement('div');
            const item_name = document.createElement('a');
            const ingredients_list = document.createElement('ul');
            const desc = document.createElement('p');

            const serving_wrapper = document.createElement('div');
            const up_arrow = document.createElement('img');
            const serving_input = document.createElement('input');
            const down_arrow = document.createElement('img');

            wrapper.classList.add('menu-wrapper');
            label.classList.add('menu-label', 'center-content');
            content_wrapper.classList.add('menu-content-wrapper');
            main_content_wrapper.classList.add('menu-main-content-wrapper');
            img.classList.add('menu-img');
            item_name.classList.add('menu-name');
            ingredients_list.classList.add('ingredients-list');
            desc.classList.add('desc');

            input.id = elem.name;
            input.type = 'checkbox';
            input.value = elem.name;
            input.checked = true;
            label.setAttribute('for', input.id);
            img.src = elem.name; // chnage it later.
            item_name.href = elem.name; // Change it later.
            item_name.appendChild(document.createTextNode(elem.name));
            desc.appendChild(document.createTextNode(elem.description));

            res.ingredients.map((ingredient) => 
            {
                const link_wrapper = document.createElement('li');
                const ingredient_link = document.createElement('a');

                ingredient_link.classList.add('ingredients-link');

                ingredient_link.appendChild(document.createTextNode(ingredient));
                link_wrapper.appendChild(ingredient_link);
                ingredients_list.appendChild(link_wrapper);
            });


            serving_input.classList.add('serving-input');
            serving_input.type = 'number';
            serving_input.value = '1'; // Chnage it later.
            serving_input.min = '1';
            serving_input.max = '20';
            serving_input.placeholder = '1'; // Chnage it later.
            serving_input.setAttribute('onchange', ' chnage_count(this, null)');

            up_arrow.src = '../arrow-up.svg';
            up_arrow.setAttribute('onclick', 'chnage_count(this.parentElement.children["1"], "add");');


            main_text_content_wrapper.appendChild(item_name);
            main_text_content_wrapper.appendChild(ingredients_list);
            main_content_wrapper.appendChild(img);
            main_content_wrapper.appendChild(main_text_content_wrapper);
            content_wrapper.appendChild(main_content_wrapper);
            content_wrapper.appendChild(desc);
            label.appendChild(content_wrapper);
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            Shopping_List.appendChild(wrapper);
        }); 
    }
    async function get_cart(user_id) 
    {
        var res = [];
        // User user_ID to query database and call display_cart.
        display_cart(res);
    }
}

get_shopping_list_init();