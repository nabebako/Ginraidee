type CookingUnit = 'string' | 'grams';
type tag = 'string' | '' | '';
type skill = 'beginer' | 'novice' | 'intermediate' | 'experience' | 'proficient';

interface Ingredient
{
    name:       string,
    amount:     number,
    unit:       CookingUnit
}

interface Dish
{
    name: string,
    rating: number,
    ingredients: Ingredient[]
}

interface CartItem
{
    name:           string,
    checked:        boolean,
    serving:        number,
    ingredients:    Ingredient[],
    description:    string
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
    email: string,
    password?: string,
}

interface LoginCookie
{
    email: string,
    accessToken: string,
}

interface CookieOptions {
    maxAge?: number | undefined;
    signed?: boolean | undefined;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    encode?: ((val: string) => string) | undefined;
    sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
}