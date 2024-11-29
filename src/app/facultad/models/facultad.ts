import { Sede } from '../../sede/models/sede';

export class Facultad {
    id: number;
    nombre: string;
    sede: Sede;

    constructor(id: number = 0, nombre: string = '',sede: Sede) {
        this.id = id;
        this.nombre = nombre;
        this.sede = sede;
    }
}
