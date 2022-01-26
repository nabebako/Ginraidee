type CookingUnit = 'string' | 'grams';
type tag = 'string' | '' | '';
type skill = 'beginer' | 'novice' | 'intermediate' | 'experience' | 'proficient';
type servingType = 'portion' | 'cup' | 'tart' | 'plate';
type timeUnit = 'd' | 'day' | 'h' | 'hour' | 'min' | 'minute' | 'sec' | 'second';
type duration = `${number} ${timeUnit}`;
type serving = `${number} ${servingType}`;

interface Ingredient
{
    name:       string,
    amount:     number,
    unit:       CookingUnit
}

interface Dish
{
    name:           string,
    description:    string,
    cookingTime:    duration,
    serving:        serving,
    rating:         number,
    level:          string,
    ingredients:    Ingredient[]
}

interface BackendCartItem
{
    name:           string,
    checked:        boolean,
    serving:        number,
}

interface FrontendCartItem
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