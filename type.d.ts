type CookingUnit = 'string' | 'grams';

interface Ingredient
{
    Name:       string,
    Amount:     number,
    Unit:       CookingUnit
}

interface CartItem
{
    Name:           string,
    Checked:        boolean,
    Serving:        number,
    Ingredients:    Ingredient[],
    Description:    string
}