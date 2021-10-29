function GET_SHOPPINT_LIST_INIT()
{
    const SHOPPING_LIST = document.getElementById('shopping-list-wrapper');

    function displayCart(res)
    {
        res.map((elem) =>
        {
            const MenuWrapper                   = document.createElement('div');
            const MenuTickBox                   = document.createElement('input');
            const MenuLabel                     = document.createElement('div');
            const MenuContentWrapper            = document.createElement('div');
            const MainContentWrapper            = document.createElement('div');
            const MenuImg                       = document.createElement('img');
            const MenuNameIngredientsWrapper    = document.createElement('div');
            const MenuName                      = document.createElement('a');
            const IngredientsList               = document.createElement('ul');
            const Description                   = document.createElement('p');
            const ServingWrapper                = document.createElement('div');
            const UpArrow                       = document.createElement('img');
            const ServingInput                  = document.createElement('input');
            const DownArrow                     = document.createElement('img');
            const ServingInputMobile            = document.createElement('select');

            MenuTickBox                         .classList.add('menu-tickbox');
            MenuWrapper                         .classList.add('menu-wrapper');
            MenuLabel                           .classList.add('menu-label', 'center-content');
            MenuContentWrapper                  .classList.add('menu-content-wrapper');
            MainContentWrapper                  .classList.add('menu-main-content-wrapper');
            MenuImg                             .classList.add('menu-img');
            MenuName                            .classList.add('menu-name');
            IngredientsList                     .classList.add('ingredients-list');
            Description                         .classList.add('desc');
            ServingInput                        .classList.add('serving-input');
            UpArrow                             .classList.add('serving-input-arrow', 'nonselect', 'clickable');
            DownArrow                           .classList.add('serving-input-arrow', 'nonselect', 'clickable');
            ServingInputMobile                  .classList.add('serving-input-mobile');

            MenuTickBox                         .id = elem.name; // chnage it later.
            MenuTickBox                         .type = 'checkbox';
            MenuTickBox                         .value = elem.name; // chnage it later.
            MenuTickBox                         .checked = true;

            MenuImg                             .src = elem.name; // chnage it later.
            MenuName                            .href = elem.name; // Change it later.

            ServingInput                        .type = 'text';
            ServingInput                        .value = '1'; // Chnage it later. Try to pull it from the user db.
            ServingInput                        .setAttribute('onchange', "chnageCount(this, 'userInput')");
            UpArrow                             .src = '../arrow-up.svg'; // Chnage the src to be absolute.
            UpArrow                             .setAttribute('onclick', "chnageCount(this.parentElement.children['1'], 'add');");
            DownArrow                           .src = '../arrow-down.svg'; // Chnage the src to be absolute.
            DownArrow                           .setAttribute('onclick', "chnageCount(this.parentElement.children['1'], 'minus');");


            res.ingredients.map((ingredient) => // add a ingrdiesnts column in db
            {
                const link_wrapper              = document.createElement('li');
                const ingredient_link           = document.createElement('a');

                ingredient_link                 .classList.add('ingredients-link');

                ingredient_link                 .appendChild(document.createTextNode(ingredient));
                link_wrapper                    .appendChild(ingredient_link);
                IngredientsList                 .appendChild(link_wrapper);
            });

            for(let i = 1; i <= 20; i++)
            {
                const option                    = document.createElement('option');
                option                          .value = `${i}`
                option                          .appendChild(document.createTextNode(`${i}`));
                ServingInputMobile              .appendChild(option);
            }

            MenuName                            .appendChild(document.createTextNode(elem.name)); // Chnage it later
            Description                         .appendChild(document.createTextNode(elem.description)); // Change it later
            MenuNameIngredientsWrapper          .appendChild(MenuName);
            MenuNameIngredientsWrapper          .appendChild(IngredientsList);
            MainContentWrapper                  .appendChild(MenuImg);
            MainContentWrapper                  .appendChild(MenuNameIngredientsWrapper);
            MenuContentWrapper                  .appendChild(MainContentWrapper);
            MenuContentWrapper                  .appendChild(Description);
            MenuLabel                           .appendChild(MenuContentWrapper);
            MenuWrapper                         .appendChild(MenuTickBox);
            MenuWrapper                         .appendChild(MenuLabel);
            ServingWrapper                      .appendChild(UpArrow);
            ServingWrapper                      .appendChild(ServingInput);
            ServingWrapper                      .appendChild(DownArrow);
            ServingWrapper                      .appendChild(ServingInputMobile);
            SHOPPING_LIST                       .appendChild(MenuWrapper);
        }); 
    }

    const XHR = new XMLHttpRequest();
    XHR.onload = () => { displayCart(JSON.parse(XHR.response)); };
    XHR.open('POST', '../getcart');
    XHR.send();
}

GET_SHOPPINT_LIST_INIT();