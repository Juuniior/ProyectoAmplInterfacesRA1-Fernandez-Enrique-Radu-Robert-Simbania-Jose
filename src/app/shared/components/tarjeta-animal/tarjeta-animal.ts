import { Component, Input } from '@angular/core';
export type EspecieAnimal = 'Perro' | 'Gato' | 'Ave' | 'Conejo' |
'Otro';
@Component({
 selector: 'app-tarjeta-animal',
 standalone: true,
 templateUrl: './tarjeta-animal.html',
 styleUrl: './tarjeta-animal.css'
})
export class TarjetaAnimal {
 @Input() nombre: string = 'Sin nombre';
 @Input() especie: EspecieAnimal = 'Otro';
 @Input() edad: string = 'Edad desconocida';
 @Input() fotoUrl: string = '';
 @Input() textoBoton: string = 'Conóceme';
}