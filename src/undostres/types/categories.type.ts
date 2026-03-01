export type CategoryType =
  | 'Recargas'
  | 'Tag'
  | 'Cine'
  | 'Luz'
  | 'Internet'
  | 'Television'
  | 'Gas'
  | 'Gobierno'
  | 'Hipoteca'
  | 'Catalogos'
  | 'Agua'
  | 'Postpago'
  | 'Entretenimiento'
  | 'Transporte'
  | 'Giftcards'
  | 'Internacionales';

  export const CategoryArray: any[] = [
    { key:'s1', label: 'Recargas', icon: 'cellphone-wireless' },
    { key:'s2', label: 'Tag', icon: 'car' },
    { key:'s3', label: 'Cine', icon: 'movie' },
    { key:'s4', label: 'Luz', icon: 'lightbulb-on' },
    { key:'s5', label: 'Internet', icon: 'wifi' },
    { key:'s6', label: 'Television', icon: 'television' },
    { key:'s7', label: 'Gas', icon: 'fire' },
    { key:'s8', label: 'Gobierno', icon: 'bank' },
    { key:'s9', label: 'Hipoteca', icon: 'home-city' },
    { key:'s10', label: 'Catalogos', icon: 'shopping' },
    { key:'s11', label: 'Agua', icon: 'water' },
    { key:'s12', label: 'Postpago', icon: 'cellphone' },
    { key:'s13', label: 'Entretenimiento', icon: 'gamepad-variant' },
    { key:'s14', label: 'Transporte', icon: 'bus' },
    { key:'s15', label: 'Giftcards', icon: 'gift' },
    { key:'s16', label: 'Internacionales', icon: 'earth' },
];

export type UDTCategoryType = 'FACTURABLE' | 'NO_FACTURABLE';