import { Component, Input } from '@angular/core';
export type VarianteBoton = 'primario' | 'secundario';
@Component({
 selector: 'app-boton-cta',
 standalone: true,
 templateUrl: './boton-cta.html',
 styleUrl: './boton-cta.css'
})
export class BotonCta {
 @Input() texto: string = 'Ver más';
 @Input() variante: VarianteBoton = 'primario';
 @Input() deshabilitado: boolean = true;
}