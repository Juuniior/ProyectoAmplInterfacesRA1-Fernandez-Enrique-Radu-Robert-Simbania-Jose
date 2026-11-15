import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MovimientoService } from '../../core/services/movimiento.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function Home_tr_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td");
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "td");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "td");
    i0.ɵɵtext(11);
    i0.ɵɵpipe(12, "number");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const movimiento_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(movimiento_r1.concepto);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(movimiento_r1.categoria);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(7, 10, movimiento_r1.fecha, "dd/MM/yyyy"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(movimiento_r1.tipo);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ingreso", movimiento_r1.tipo === "Ingreso")("gasto", movimiento_r1.tipo === "Gasto");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", movimiento_r1.tipo === "Ingreso" ? "+" : "-", " ", i0.ɵɵpipeBind2(12, 13, movimiento_r1.importe, "1.2-2"), " \u20AC ");
} }
function Home_tr_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 14);
    i0.ɵɵtext(2, " Todav\u00EDa no hay movimientos registrados. ");
    i0.ɵɵelementEnd()();
} }
registerLocaleData(localeEs);
export class Home {
    movimientoService = inject(MovimientoService);
    // La señal permite que Home se actualice al cambiar los movimientos.
    get movimientos() {
        return this.movimientoService.movimientos();
    }
    // Calcula el total de ingresos.
    get totalIngresos() {
        return this.movimientos
            .filter(movimiento => movimiento.tipo === 'Ingreso')
            .reduce((total, movimiento) => total + movimiento.importe, 0);
    }
    // Calcula el total de gastos.
    get totalGastos() {
        return this.movimientos
            .filter(movimiento => movimiento.tipo === 'Gasto')
            .reduce((total, movimiento) => total + movimiento.importe, 0);
    }
    // Calcula el saldo actual.
    get saldoActual() {
        return this.totalIngresos - this.totalGastos;
    }
    // Devuelve los movimientos ordenados por fecha, del más reciente al más antiguo.
    get ultimosMovimientos() {
        return [...this.movimientos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
    static ɵfac = function Home_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Home)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Home, selectors: [["app-home"]], features: [i0.ɵɵProvidersFeature([{ provide: LOCALE_ID, useValue: 'es-ES' }])], decls: 53, vars: 14, consts: [[1, "home"], [1, "home__bienvenida"], [1, "home__resumen"], [1, "tarjeta"], [1, "tarjeta__cabecera"], ["aria-hidden", "true", 1, "tarjeta__icono", "tarjeta__icono--saldo"], [1, "tarjeta__importe"], ["aria-hidden", "true", 1, "tarjeta__icono", "tarjeta__icono--ingreso"], [1, "tarjeta__importe", "tarjeta__importe--ingreso"], ["aria-hidden", "true", 1, "tarjeta__icono", "tarjeta__icono--gasto"], [1, "tarjeta__importe", "tarjeta__importe--gasto"], [1, "home__movimientos"], [4, "ngFor", "ngForOf"], [4, "ngIf"], ["colspan", "5", 1, "tabla-vacia"]], template: function Home_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "section", 1)(2, "h1");
            i0.ɵɵtext(3, "Bienvenido a ContaLite");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Controla tus ingresos y gastos de forma sencilla.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "section", 2)(7, "article", 3)(8, "div", 4)(9, "h2");
            i0.ɵɵtext(10, "Saldo actual");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "span", 5);
            i0.ɵɵtext(12, "\u20AC");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "p", 6);
            i0.ɵɵtext(14);
            i0.ɵɵpipe(15, "number");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "article", 3)(17, "div", 4)(18, "h2");
            i0.ɵɵtext(19, "Ingresos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "span", 7);
            i0.ɵɵtext(21, "\u2197");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "p", 8);
            i0.ɵɵtext(23);
            i0.ɵɵpipe(24, "number");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "article", 3)(26, "div", 4)(27, "h2");
            i0.ɵɵtext(28, "Gastos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "span", 9);
            i0.ɵɵtext(30, "\u2198");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(31, "p", 10);
            i0.ɵɵtext(32);
            i0.ɵɵpipe(33, "number");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(34, "section", 11)(35, "h2");
            i0.ɵɵtext(36, "\u00DAltimos movimientos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "table")(38, "thead")(39, "tr")(40, "th");
            i0.ɵɵtext(41, "Concepto");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "th");
            i0.ɵɵtext(43, "Categor\u00EDa");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "th");
            i0.ɵɵtext(45, "Fecha");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "th");
            i0.ɵɵtext(47, "Tipo");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "th");
            i0.ɵɵtext(49, "Importe");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(50, "tbody");
            i0.ɵɵtemplate(51, Home_tr_51_Template, 13, 16, "tr", 12)(52, Home_tr_52_Template, 3, 0, "tr", 13);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(14);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(15, 5, ctx.saldoActual, "1.2-2"), " \u20AC ");
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(24, 8, ctx.totalIngresos, "1.2-2"), " \u20AC ");
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(33, 11, ctx.totalGastos, "1.2-2"), " \u20AC ");
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("ngForOf", ctx.ultimosMovimientos);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.ultimosMovimientos.length === 0);
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, i1.DecimalPipe, i1.DatePipe], styles: [".home[_ngcontent-%COMP%] {\n  font-family: 'Segoe UI', sans-serif;\n  color: #263238;\n  padding: 30px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n\n.home__bienvenida[_ngcontent-%COMP%] {\n  margin-bottom: 30px;\n}\n\n.home__bienvenida[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 28px;\n  margin-bottom: 8px;\n}\n\n.home__bienvenida[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #607d8b;\n  font-size: 15px;\n}\n\n\n.home__resumen[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  margin-bottom: 40px;\n}\n\n.tarjeta[_ngcontent-%COMP%] {\n  background-color: #ffffff;\n  border: 1px solid #e0e0e0;\n  border-radius: 10px;\n  padding: 20px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.tarjeta[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n\n\n.tarjeta__cabecera[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n\n.tarjeta__cabecera[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 15px;\n  color: #607d8b;\n  margin: 0;\n}\n\n\n.tarjeta__icono[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: bold;\n}\n\n.tarjeta__icono--saldo[_ngcontent-%COMP%] {\n  background-color: #e8edf2;\n  color: #455a64;\n}\n\n.tarjeta__icono--ingreso[_ngcontent-%COMP%] {\n  background-color: #e8f5e9;\n  color: #2e7d32;\n}\n\n.tarjeta__icono--gasto[_ngcontent-%COMP%] {\n  background-color: #ffebee;\n  color: #c62828;\n}\n\n\n.tarjeta__importe[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 0;\n}\n\n.tarjeta__importe--ingreso[_ngcontent-%COMP%], \n.ingreso[_ngcontent-%COMP%] {\n  color: #2e7d32;\n}\n\n.tarjeta__importe--gasto[_ngcontent-%COMP%], \n.gasto[_ngcontent-%COMP%] {\n  color: #c62828;\n}\n\n\n.home__movimientos[_ngcontent-%COMP%] {\n  background-color: #ffffff;\n  border: 1px solid #e0e0e0;\n  border-radius: 10px;\n  padding: 20px;\n  overflow-x: auto;\n}\n\n.home__movimientos[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 20px;\n  margin-top: 0;\n  margin-bottom: 20px;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 600px;\n  border-collapse: collapse;\n  font-size: 14px;\n}\n\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eeeeee;\n}\n\nth[_ngcontent-%COMP%] {\n  background-color: #f5f7f8;\n  color: #455a64;\n  font-weight: 600;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background-color: #f8fafb;\n}\n\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\n  border-bottom: none;\n}\n\n\n.home__movimientos[_ngcontent-%COMP%]   td.ingreso[_ngcontent-%COMP%], \n.home__movimientos[_ngcontent-%COMP%]   td.gasto[_ngcontent-%COMP%] {\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n\n@media (max-width: 700px) {\n  .home__resumen[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .home[_ngcontent-%COMP%] {\n    padding: 20px;\n  }\n\n  .home__movimientos[_ngcontent-%COMP%] {\n    padding: 15px;\n  }\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Home, [{
        type: Component,
        args: [{ selector: 'app-home', standalone: true, imports: [CommonModule], providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }], template: "\n<main class=\"home\">\n\n  <!-- Secci\u00F3n de bienvenida -->\n  <section class=\"home__bienvenida\">\n    <h1>Bienvenido a ContaLite</h1>\n    <p>Controla tus ingresos y gastos de forma sencilla.</p>\n  </section>\n\n  <!-- Resumen econ\u00F3mico -->\n  <section class=\"home__resumen\">\n\n    <!-- Tarjeta de saldo -->\n    <article class=\"tarjeta\">\n      <div class=\"tarjeta__cabecera\">\n        <h2>Saldo actual</h2>\n        <span class=\"tarjeta__icono tarjeta__icono--saldo\"\n              aria-hidden=\"true\">\u20AC</span>\n      </div>\n\n      <p class=\"tarjeta__importe\">\n        {{ saldoActual | number:'1.2-2' }} \u20AC\n      </p>\n    </article>\n\n    <!-- Tarjeta de ingresos -->\n    <article class=\"tarjeta\">\n      <div class=\"tarjeta__cabecera\">\n        <h2>Ingresos</h2>\n        <span class=\"tarjeta__icono tarjeta__icono--ingreso\"\n              aria-hidden=\"true\">\u2197</span>\n      </div>\n\n      <p class=\"tarjeta__importe tarjeta__importe--ingreso\">\n        {{ totalIngresos | number:'1.2-2' }} \u20AC\n      </p>\n    </article>\n\n    <!-- Tarjeta de gastos -->\n    <article class=\"tarjeta\">\n      <div class=\"tarjeta__cabecera\">\n        <h2>Gastos</h2>\n        <span class=\"tarjeta__icono tarjeta__icono--gasto\"\n              aria-hidden=\"true\">\u2198</span>\n      </div>\n\n      <p class=\"tarjeta__importe tarjeta__importe--gasto\">\n        {{ totalGastos | number:'1.2-2' }} \u20AC\n      </p>\n    </article>\n\n  </section>\n\n  <!-- \u00DAltimos movimientos -->\n  <section class=\"home__movimientos\">\n\n    <h2>\u00DAltimos movimientos</h2>\n\n    <table>\n      <thead>\n        <tr>\n          <th>Concepto</th>\n          <th>Categor\u00EDa</th>\n          <th>Fecha</th>\n          <th>Tipo</th>\n          <th>Importe</th>\n        </tr>\n      </thead>\n\n      <tbody>\n        <tr *ngFor=\"let movimiento of ultimosMovimientos\">\n\n          <td>{{ movimiento.concepto }}</td>\n\n          <td>{{ movimiento.categoria }}</td>\n\n          <td>{{ movimiento.fecha | date:'dd/MM/yyyy' }}</td>\n\n          <td>{{ movimiento.tipo }}</td>\n\n          <td\n            [class.ingreso]=\"movimiento.tipo === 'Ingreso'\"\n            [class.gasto]=\"movimiento.tipo === 'Gasto'\"\n          >\n            {{ movimiento.tipo === 'Ingreso' ? '+' : '-' }}\n            {{ movimiento.importe | number:'1.2-2' }} \u20AC\n          </td>\n\n        </tr>\n\n        <tr *ngIf=\"ultimosMovimientos.length === 0\">\n          <td colspan=\"5\" class=\"tabla-vacia\">\n            Todav\u00EDa no hay movimientos registrados.\n          </td>\n        </tr>\n      </tbody>\n    </table>\n\n  </section>\n\n</main>\n", styles: ["\n.home {\n  font-family: 'Segoe UI', sans-serif;\n  color: #263238;\n  padding: 30px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n/* Secci\u00F3n de bienvenida */\n.home__bienvenida {\n  margin-bottom: 30px;\n}\n\n.home__bienvenida h1 {\n  font-size: 28px;\n  margin-bottom: 8px;\n}\n\n.home__bienvenida p {\n  color: #607d8b;\n  font-size: 15px;\n}\n\n/* Tarjetas del resumen econ\u00F3mico */\n.home__resumen {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  margin-bottom: 40px;\n}\n\n.tarjeta {\n  background-color: #ffffff;\n  border: 1px solid #e0e0e0;\n  border-radius: 10px;\n  padding: 20px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.tarjeta:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);\n}\n\n/* Cabecera de las tarjetas */\n.tarjeta__cabecera {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 12px;\n}\n\n.tarjeta__cabecera h2 {\n  font-size: 15px;\n  color: #607d8b;\n  margin: 0;\n}\n\n/* Iconos de las tarjetas */\n.tarjeta__icono {\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: bold;\n}\n\n.tarjeta__icono--saldo {\n  background-color: #e8edf2;\n  color: #455a64;\n}\n\n.tarjeta__icono--ingreso {\n  background-color: #e8f5e9;\n  color: #2e7d32;\n}\n\n.tarjeta__icono--gasto {\n  background-color: #ffebee;\n  color: #c62828;\n}\n\n/* Importes */\n.tarjeta__importe {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 0;\n}\n\n.tarjeta__importe--ingreso,\n.ingreso {\n  color: #2e7d32;\n}\n\n.tarjeta__importe--gasto,\n.gasto {\n  color: #c62828;\n}\n\n/* Tabla de movimientos */\n.home__movimientos {\n  background-color: #ffffff;\n  border: 1px solid #e0e0e0;\n  border-radius: 10px;\n  padding: 20px;\n  overflow-x: auto;\n}\n\n.home__movimientos h2 {\n  font-size: 20px;\n  margin-top: 0;\n  margin-bottom: 20px;\n}\n\ntable {\n  width: 100%;\n  min-width: 600px;\n  border-collapse: collapse;\n  font-size: 14px;\n}\n\nth,\ntd {\n  padding: 12px;\n  text-align: left;\n  border-bottom: 1px solid #eeeeee;\n}\n\nth {\n  background-color: #f5f7f8;\n  color: #455a64;\n  font-weight: 600;\n}\n\ntbody tr:hover {\n  background-color: #f8fafb;\n}\n\ntbody tr:last-child td {\n  border-bottom: none;\n}\n\n/* Destacar los importes de la tabla */\n.home__movimientos td.ingreso,\n.home__movimientos td.gasto {\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n/* Adaptaci\u00F3n a pantallas peque\u00F1as */\n@media (max-width: 700px) {\n  .home__resumen {\n    grid-template-columns: 1fr;\n  }\n\n  .home {\n    padding: 20px;\n  }\n\n  .home__movimientos {\n    padding: 15px;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Home, { className: "Home", filePath: "src/app/features/home/home.ts", lineNumber: 17 }); })();
