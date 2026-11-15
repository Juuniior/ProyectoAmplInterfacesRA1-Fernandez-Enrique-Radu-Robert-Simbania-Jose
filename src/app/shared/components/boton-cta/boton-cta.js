import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class BotonCta {
    texto = 'Ver más';
    variante = 'primario';
    deshabilitado = true;
    static ɵfac = function BotonCta_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BotonCta)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BotonCta, selectors: [["app-boton-cta"]], inputs: { texto: "texto", variante: "variante", deshabilitado: "deshabilitado" }, decls: 2, vars: 7, consts: [[1, "boton-cta"]], template: function BotonCta_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "a", 0);
            i0.ɵɵtext(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("boton-cta--secundario", ctx.variante === "secundario")("boton-cta--deshabilitado", ctx.deshabilitado);
            i0.ɵɵattribute("aria-disabled", ctx.deshabilitado ? "true" : null)("tabindex", ctx.deshabilitado ? "-1" : null);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.texto, "\n");
        } }, styles: ["boton-cta[_ngcontent-%COMP%] {\n --%NS%color-acento: #3f5c4e;\n --%NS%color-acento-suave: #eef1ee;\n display: inline-block;\n font-family: 'Segoe UI', system-ui, sans-serif;\n font-size: 14px;\n font-weight: 600;\n text-decoration: none;\n padding: 12px 24px;\n border-radius: 8px;\n background-color: var(--%NS%color-acento);\n color: #ffffff;\n border: 1px solid var(--%NS%color-acento);\n cursor: pointer;\n}\n.boton-cta--secundario[_ngcontent-%COMP%] {\n background-color: var(--%NS%color-acento-suave);\n color: var(--%NS%color-acento);\n border-color: var(--%NS%color-acento-suave);\n}\n.boton-cta--deshabilitado[_ngcontent-%COMP%] {\n cursor: not-allowed;\n pointer-events: none;\n opacity: 0.6;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BotonCta, [{
        type: Component,
        args: [{ selector: 'app-boton-cta', standalone: true, template: "<a\n class=\"boton-cta\"\n [class.boton-cta--secundario]=\"variante === 'secundario'\"\n [class.boton-cta--deshabilitado]=\"deshabilitado\"\n [attr.aria-disabled]=\"deshabilitado ? 'true' : null\"\n [attr.tabindex]=\"deshabilitado ? '-1' : null\">\n {{ texto }}\n</a>", styles: ["boton-cta {\n --color-acento: #3f5c4e;\n --color-acento-suave: #eef1ee;\n display: inline-block;\n font-family: 'Segoe UI', system-ui, sans-serif;\n font-size: 14px;\n font-weight: 600;\n text-decoration: none;\n padding: 12px 24px;\n border-radius: 8px;\n background-color: var(--color-acento);\n color: #ffffff;\n border: 1px solid var(--color-acento);\n cursor: pointer;\n}\n.boton-cta--secundario {\n background-color: var(--color-acento-suave);\n color: var(--color-acento);\n border-color: var(--color-acento-suave);\n}\n.boton-cta--deshabilitado {\n cursor: not-allowed;\n pointer-events: none;\n opacity: 0.6;\n}\n"] }]
    }], null, { texto: [{
            type: Input
        }], variante: [{
            type: Input
        }], deshabilitado: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BotonCta, { className: "BotonCta", filePath: "src/app/shared/components/boton-cta/boton-cta.ts", lineNumber: 9 }); })();
