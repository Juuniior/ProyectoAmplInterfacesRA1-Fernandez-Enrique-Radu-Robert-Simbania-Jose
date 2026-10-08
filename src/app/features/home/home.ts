import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TarjetaAnimal } from '../../shared/components/tarjeta-animal/tarjeta-animal';
import { BotonCta } from '../../shared/components/boton-cta/boton-cta';

interface AnimalDestacado {
  nombre: string;
  especie: 'Perro' | 'Gato' | 'Ave' | 'Conejo' | 'Otro';
  edad: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TarjetaAnimal,
    BotonCta
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  animalesDestacados: AnimalDestacado[] = [
    {
      nombre: 'Luna',
      especie: 'Perro',
      edad: '2 años'
    },
    {
      nombre: 'Simba',
      especie: 'Gato',
      edad: '1 año'
    },
    {
      nombre: 'Kiwi',
      especie: 'Ave',
      edad: '6 meses'
    },
    {
      nombre: 'Coco',
      especie: 'Conejo',
      edad: '8 meses'
    }
  ];

}