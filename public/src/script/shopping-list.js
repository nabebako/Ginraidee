function updateCart() {
    let cart = [];
    document.querySelectorAll('.menu-wrapper').forEach((elem) => {
        const TickBox = elem.querySelector('input.menu-tickbox');
        const Serving = elem.querySelector('input.serving-input');
        cart.push({
            'name': TickBox.value,
            'checked': TickBox.checked,
            'serving': parseInt(Serving.value, 10)
        });
    });
    const SaveCart = new XMLHttpRequest();
    SaveCart.open('POST', '/updateCart');
    SaveCart.setRequestHeader('content-type', 'application/json');
    SaveCart.send(JSON.stringify(cart));
}
function removeCartItem(item) {
    while (item.childElementCount > 0) {
        item.firstChild.remove();
    }
    const MenuTickBox = item.querySelector('input.menu-tickbox');
    const Remove = new XMLHttpRequest();
    Remove.open('post', '/removecartitem');
    Remove.send(MenuTickBox.value);
}
function displayCart(res) {
    const SHOPPING_LIST = document.getElementById('shopping-list-wrapper');
    res.map((elem) => {
        const MenuWrapper = document.createElement('div');
        const MenuTickBox = document.createElement('input');
        const MenuLabel = document.createElement('div');
        const MenuContentWrapper = document.createElement('div');
        const MainContentWrapper = document.createElement('div');
        const MenuImg = document.createElement('img');
        const MenuNameIngredientsWrapper = document.createElement('div');
        const MenuName = document.createElement('a');
        const IngredientsList = document.createElement('ul');
        const Description = document.createElement('p');
        const ServingWrapper = document.createElement('div');
        const UpArrow = document.createElement('img');
        const ServingInput = document.createElement('input');
        const DownArrow = document.createElement('img');
        const ServingInputMobile = document.createElement('select');
        const RemoveButton = document.createElement('button');
        MenuTickBox.classList.add('menu-tickbox');
        MenuWrapper.classList.add('menu-wrapper');
        MenuLabel.classList.add('menu-label', 'center-content');
        MenuContentWrapper.classList.add('menu-content-wrapper');
        MainContentWrapper.classList.add('menu-main-content-wrapper');
        MenuImg.classList.add('menu-img');
        MenuName.classList.add('menu-name');
        IngredientsList.classList.add('ingredients-list');
        Description.classList.add('desc');
        ServingInput.classList.add('serving-input');
        UpArrow.classList.add('serving-input-arrow', 'nonselect', 'clickable');
        DownArrow.classList.add('serving-input-arrow', 'nonselect', 'clickable');
        ServingInputMobile.classList.add('serving-input-mobile');
        //RemoveButton                        .classList.add('');
        MenuWrapper.id = elem.name;
        MenuTickBox.type = 'checkbox';
        MenuTickBox.value = elem.name;
        MenuTickBox.checked = elem.checked;
        MenuTickBox.setAttribute('onclick', 'updateCart()');
        MenuImg.src = `${elem.name.replace(' ', '-').toLowerCase()}.png`; // Chnge it later
        MenuName.href = `${elem.name.replace(' ', '-').toLowerCase()}.html`; // Change it to be absolute
        ServingInput.type = 'text';
        ServingInput.name = elem.name;
        ServingInput.value = String(elem.serving);
        ServingInput.setAttribute('oninput', 'chnageCount(this, \'userInput\');');
        ServingInput.setAttribute('onchange', 'updateCart();');
        UpArrow.setAttribute('increase', 'true');
        DownArrow.setAttribute('decrease', 'true');
        UpArrow.src = '../resources/svg/arrow-up.svg'; // Chnage the src to be absolute.
        DownArrow.src = '../resources/svg/arrow-down.svg'; // Chnage the src to be absolute.
        UpArrow.setAttribute('onclick', 'chnageCount(this.nextElementSibling, \'add\'); updateCart();');
        DownArrow.setAttribute('onclick', 'chnageCount(this.previousElementSibling, \'minus\'); updateCart();');
        RemoveButton.setAttribute('onclick', 'removeCartItem(MenuWrapper);');
        elem.ingredients.map((ingredient) => // add a ingrdiesnts column in db
         {
            const link_wrapper = document.createElement('li');
            const ingredient_link = document.createElement('a');
            ingredient_link.classList.add('ingredients-link');
            ingredient_link.appendChild(document.createTextNode(`${ingredient.amount} ${ingredient.unit} of ${ingredient.name}`));
            link_wrapper.appendChild(ingredient_link);
            IngredientsList.appendChild(link_wrapper);
        });
        for (let i = 1; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = `${i}`;
            option.appendChild(document.createTextNode(`${i}`));
            ServingInputMobile.appendChild(option);
        }
        MenuName.appendChild(document.createTextNode(elem.name)); // Chnage it later
        Description.appendChild(document.createTextNode(elem.description)); // Change it later
        MenuNameIngredientsWrapper.appendChild(MenuName);
        MenuNameIngredientsWrapper.appendChild(IngredientsList);
        MainContentWrapper.appendChild(MenuImg);
        MainContentWrapper.appendChild(MenuNameIngredientsWrapper);
        MenuContentWrapper.appendChild(MainContentWrapper);
        MenuContentWrapper.appendChild(Description);
        ServingWrapper.appendChild(UpArrow);
        ServingWrapper.appendChild(ServingInput);
        ServingWrapper.appendChild(DownArrow);
        ServingWrapper.appendChild(ServingInputMobile);
        MenuLabel.appendChild(MenuContentWrapper);
        MenuLabel.appendChild(ServingWrapper);
        MenuWrapper.appendChild(MenuTickBox);
        MenuWrapper.appendChild(MenuLabel);
        SHOPPING_LIST.appendChild(MenuWrapper);
    });
}
const getShoppingList = () => {
    const ShoppingList = new XMLHttpRequest();
    ShoppingList.onload = () => {
        const SHOPPING_LIST = document.getElementById('shopping-list-wrapper');
        if (ShoppingList.status === 200) {
            const CartObj = JSON.parse(ShoppingList.response);
            let CartList = [];
            Object.keys(CartObj).map((key) => { CartList.push(CartObj[key]); });
            displayCart(CartList);
        }
        else if (ShoppingList.status === 404) {
            const ErrorMessage = document.createElement('p');
            const SignIn = document.createElement('a');
            const SignUp = document.createElement('a');
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
    ShoppingList.open('get', '/cart');
    ShoppingList.send();
};
window.addEventListener('load', getShoppingList);
