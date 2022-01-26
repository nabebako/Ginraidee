type cookingUnit = 'string' | 'grams';
type tag = 'string' | '' | '';
type skill = 'beginer' | 'novice' | 'intermediate' | 'experience' | 'proficient';
type servingType = 'portion' | 'cup' | 'tart' | 'plate';
type timeUnit = 'd' | 'day' | 'h' | 'hour' | 'min' | 'minute' | 'sec' | 'second';
type duration = `${number} ${timeUnit}`;
type serving = `${number} ${servingType}`;

declare namespace General
{
    interface Ingredient
    {
        'ingredient-name':      string,
        'amount-per-serving':   serving,
        'unit':                 cookingUnit,
    }
}


interface CartItem
{
    name:           string,
    checked:        boolean,
    serving:        number,
    ingredients:    General.Ingredient[],
    description:    string,
}

interface UpdateCartInfo
{
    name:       string,
    checked:    boolean,
    serving:    number
}

interface MenuObject
{
    name: string,
    raiting: number,
    skill: skill,
    cooking_time: string,
    tags: tag[],
    description: string
}

interface LoginInfo
{
    'email': string,
    'password': string,
    'remember-me': boolean,
}





/**
    * Interfaces for database tables
*/

declare namespace Table
{
    interface Cart
    {
        'cart-id'?:             string,
        'geust-id'?:            string,
        'user-id'?:             string,
        'session-id'?:          string,
        'items'?:               CartItem[],
    }

    interface CartItem
    {
        'dish-id':          number,
        'serving-amount':   number,
        'is-checked':       boolean,
    }


    interface Ingredient
    {
        'ingredient-id'?:       string,
        'name'?:                string,
        'unit'?:                string,
        'related-menus-id'?:    number[],
    }

    interface Dish
    {
        'dish-id'?:             number,
        'name'?:                string,
        'rating'?:              number,
        'level'?:               string,
        'tags'?:                string[],
        'description'?:         string,
        'cooking-time'?:         duration,
        'serving'?:             serving,
        'ingredients'?:         General.Ingredient[],
    }

    interface Form
    {
        'form-id'?:             number,
        'session-id'?:          string,
        'current-form'?:        string,
        'form-1'?:              object,
        'form-2'?:              object,
        'form-3'?:              object,
        'user-id'?:             string,
        'guest-id'?:            string,
    }

    interface Guest
    {
        'guest-id'?:            string,
        'session-id'?:          string,
        'cart-id'?:             string,
        'form-id'?:             number,
    }

    interface User
    {
        'user-id'?:              string,
        'email'?:                string,
        'session-id'?:           string,
        'access-token'?:         string,
        'password'?:             string,
        'salt'?:                 string,
        'cart-id'?:              string,
        'form-id'?:              number,
    }
}