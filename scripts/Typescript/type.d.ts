type CookingUnit = 'string' | 'grams';
type tag = 'string' | '' | '';
type skill = 'beginer' | 'novice' | 'intermediate' | 'experience' | 'proficient';

interface Ingredient
{
    name:       string,
    amount:     number,
    unit:       CookingUnit
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

interface menuObject
{
    name: string,
    raiting: number,
    skill: skill,
    cooking_time: string,
    tags: tag[],
    description: string
}

