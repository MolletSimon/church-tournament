export type Phase = {
    id?: number,
    name?: string,
    type?: 'Poules' | 'Elimination directe';
    isAllerRetour: boolean,
    nombreEquipesParPoule: number,
    nombreQualifiesParPoule: number,
}