import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class TarjetaAnimal {
    nombre = 'Sin nombre';
    especie = 'Otro';
    edad = 'Edad desconocida';
    fotoUrl = '';
    textoBoton = 'Conóceme';
    static ɵfac = function TarjetaAnimal_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TarjetaAnimal)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TarjetaAnimal, selectors: [["app-tarjeta-animal"]], inputs: { nombre: "nombre", especie: "especie", edad: "edad", fotoUrl: "fotoUrl", textoBoton: "textoBoton" }, decls: 9, vars: 6, consts: [[1, "tarjeta-animal"], ["aria-hidden", "true", 1, "tarjeta-animal__foto"], [1, "tarjeta-animal__info"], [1, "tarjeta-animal__nombre"], [1, "tarjeta-animal__detalle"], ["aria-disabled", "true", "tabindex", "-1", 1, "tarjeta-animal__boton"]], template: function TarjetaAnimal_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "article", 0);
            i0.ɵɵdomElement(1, "div", 1);
            i0.ɵɵdomElementStart(2, "div", 2)(3, "h3", 3);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "p", 4);
            i0.ɵɵtext(6);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(7, "a", 5);
            i0.ɵɵtext(8);
            i0.ɵɵdomElementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵstyleProp("background-image", ctx.fotoUrl ? "url(" + ctx.fotoUrl + ")" : null);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.nombre);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.especie, " \u00B7 ", ctx.edad);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.textoBoton);
        } }, styles: [".tarjeta-animal[_ngcontent-%COMP%] {\n --%NS%color-texto: #232620;\n --%NS%color-texto-suave: #6d6f68;\n --%NS%color-fondo: #ffffff;\n --%NS%color-fondo-suave: #f6f8f6;\n --%NS%color-borde: #e4e3df;\n --%NS%color-acento: #3f5c4e;\n border: 1px solid var(--%NS%color-borde);\n border-radius: 12px;\n overflow: hidden;\n background-color: var(--%NS%color-fondo);\n font-family: 'Segoe UI', system-ui, sans-serif;\n color: var(--%NS%color-texto);\n transition: box-shadow 0.15s ease;\n display: block;\n}\n.tarjeta-animal[_ngcontent-%COMP%]:hover {\n box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);\n}\n.tarjeta-animal__foto[_ngcontent-%COMP%] {\n aspect-ratio: 4 / 3;\n background-color: var(--%NS%color-fondo-suave);\n background-size: cover;\n background-position: center;\n}\n.tarjeta-animal__info[_ngcontent-%COMP%] {\n padding: 14px 16px;\n}\n.tarjeta-animal__nombre[_ngcontent-%COMP%] {\n font-size: 15px;\n font-weight: 600;\n margin: 0 0 4px;\n}\n.tarjeta-animal__detalle[_ngcontent-%COMP%] {\n font-size: 13px;\n color: var(--%NS%color-texto-suave);\n margin: 0 0 12px;\n}\n.tarjeta-animal__boton[_ngcontent-%COMP%] {\n display: inline-block;\n font-size: 13px;\n font-weight: 600;\n  color: var(--%NS%color-acento);\n text-decoration: none;\n cursor: not-allowed;\n pointer-events: none;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TarjetaAnimal, [{
        type: Component,
        args: [{ selector: 'app-tarjeta-animal', standalone: true, template: "<article class=\"tarjeta-animal\">\n <div\n class=\"tarjeta-animal__foto\"\n [style.background-image]=\"fotoUrl ? 'url(' + fotoUrl + ')' :\nnull\"\n aria-hidden=\"true\">\n </div>\n <div class=\"tarjeta-animal__info\">\n <h3 class=\"tarjeta-animal__nombre\">{{ nombre }}</h3>\n <p class=\"tarjeta-animal__detalle\">{{ especie }} \u00B7 {{ edad\n}}</p>\n <a class=\"tarjeta-animal__boton\" aria-disabled=\"true\"\ntabindex=\"-1\">{{ textoBoton }}</a>\n </div>\n</article>", styles: [".tarjeta-animal {\n --color-texto: #232620;\n --color-texto-suave: #6d6f68;\n --color-fondo: #ffffff;\n --color-fondo-suave: #f6f8f6;\n --color-borde: #e4e3df;\n --color-acento: #3f5c4e;\n border: 1px solid var(--color-borde);\n border-radius: 12px;\n overflow: hidden;\n background-color: var(--color-fondo);\n font-family: 'Segoe UI', system-ui, sans-serif;\n color: var(--color-texto);\n transition: box-shadow 0.15s ease;\n display: block;\n}\n.tarjeta-animal:hover {\n box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);\n}\n.tarjeta-animal__foto {\n aspect-ratio: 4 / 3;\n background-color: var(--color-fondo-suave);\n background-size: cover;\n background-position: center;\n}\n.tarjeta-animal__info {\n padding: 14px 16px;\n}\n.tarjeta-animal__nombre {\n font-size: 15px;\n font-weight: 600;\n margin: 0 0 4px;\n}\n.tarjeta-animal__detalle {\n font-size: 13px;\n color: var(--color-texto-suave);\n margin: 0 0 12px;\n}\n.tarjeta-animal__boton {\n display: inline-block;\n font-size: 13px;\n font-weight: 600;\n  color: var(--color-acento);\n text-decoration: none;\n cursor: not-allowed;\n pointer-events: none;\n}"] }]
    }], null, { nombre: [{
            type: Input
        }], especie: [{
            type: Input
        }], edad: [{
            type: Input
        }], fotoUrl: [{
            type: Input
        }], textoBoton: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TarjetaAnimal, { className: "TarjetaAnimal", filePath: "src/app/shared/components/tarjeta-animal/tarjeta-animal.ts", lineNumber: 10 }); })();
