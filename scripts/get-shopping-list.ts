function updateCart()
{
    let cart = [];
    document.querySelectorAll('.menu-wrapper').forEach(elem =>
    {
        const TickBox: HTMLInputElement = elem.querySelector('input.menu-tickbox');
        const Serving: HTMLInputElement = elem.querySelector('input.serving-input');
        cart.push({
            'Name': TickBox.id,
            'Tick': TickBox.checked,
            'Serving': Serving.value
        });
    });

    const SaveCart = new XMLHttpRequest();
    SaveCart.open('POST', '/updateCart');
    SaveCart.send(JSON.stringify(cart));
}

function chnageCount(elem: HTMLInputElement, type: string)
{
    elem.value = elem.value.replace(/[^0-9]/g , '')
    if(elem.value == '')
    {
        elem.value = '';
        return;
    }

    var val = parseInt(elem.value, 10);
    
    if(type == '') { return; }
    if(type == 'userInput')
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

function removeCartItem(item: HTMLDivElement)
{
    while(item.childElementCount > 0) { item.firstChild.remove(); }
    const MenuTickBox: HTMLInputElement = item.querySelector('input.menu-tickbox');

    const Remove = new XMLHttpRequest();
    Remove.open('post', '/removecartitem');
    Remove.send(MenuTickBox.value);
}

function getShoppingList()
{
    function displayCart(res: CartItem[])
    {
        const SHOPPING_LIST = document.getElementById('shopping-list-wrapper');
        
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
            const RemoveButton                  = document.createElement('button');

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
            RemoveButton                        .classList.add('');

            MenuWrapper                         .id = elem.Name;

            MenuTickBox                         .type = 'checkbox';
            MenuTickBox                         .value = elem.Name;
            MenuTickBox                         .checked = elem.Checked;
            MenuTickBox                         .onclick = () => updateCart();

            MenuImg                             .src = elem.Name;
            MenuName                            .href = elem.Name;

            ServingInput                        .type = 'text';
            ServingInput                        .value = String(elem.Serving);
            ServingInput                        .onchange = () => chnageCount(this, 'userInput');
            UpArrow                             .src = '../arrow-up.svg'; // Chnage the src to be absolute.
            UpArrow                             .onclick = () => chnageCount(this.parentElement.children['1'], 'add');
            DownArrow                           .src = '../arrow-down.svg'; // Chnage the src to be absolute.
            DownArrow                           .onclick = () => chnageCount(this.parentElement.children['1'], 'minus');
            
            RemoveButton                        .onclick = () => removeCartItem(MenuWrapper);

            elem.Ingredients.map((ingredient: Ingredient) => // add a ingrdiesnts column in db
            {
                const link_wrapper              = document.createElement('li');
                const ingredient_link           = document.createElement('a');

                ingredient_link                 .classList.add('ingredients-link');

                ingredient_link                 .appendChild(document.createTextNode(ingredient.Amount + ingredient.Unit + ingredient.Name));
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

            MenuName                            .appendChild(document.createTextNode(elem.Name)); // Chnage it later
            Description                         .appendChild(document.createTextNode(elem.Description)); // Change it later
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
    XHR.onload = () =>
    {
        const SHOPPING_LIST = document.getElementById('shopping-list-wrapper');

        if(XHR.status === 200)
        {
            displayCart(JSON.parse(XHR.response));
        }
        else if(XHR.status === 404)
        {
            const ErrorMessage  = document.createElement('p');
            const SignIn        = document.createElement('a');
            const SignUp        = document.createElement('a');

            SignIn.classList.add();
            SignUp.classList.add();

            SignIn.href = ''; // Set later
            SignUp.href = ''; // Set later

            ErrorMessage.appendChild(document.createTextNode('404: cart not found.'));
            SignIn.appendChild(document.createElement('p').appendChild(document.createTextNode('Sign In')));
            SignUp.appendChild(document.createElement('p').appendChild(document.createTextNode('Sign Up')));

            SHOPPING_LIST.appendChild(ErrorMessage);
            SHOPPING_LIST.appendChild(SignIn);
            SHOPPING_LIST.appendChild(SignUp);
        }
    };
    XHR.open('POST', '/getcart');
    XHR.send();
}

getShoppingList();