export interface Coords {
	x: number,
	y: number,
}

export interface CreatureDetails {
    id?: string,
    name?: string,
    stat?: string,
    tier?: CreatureTier
}

export enum CreatureTier {
    NORMAL = 'normal',
    RARE = 'rare',
    UNIQUE = 'unique',
    LEGENDARY = 'legendary'
}