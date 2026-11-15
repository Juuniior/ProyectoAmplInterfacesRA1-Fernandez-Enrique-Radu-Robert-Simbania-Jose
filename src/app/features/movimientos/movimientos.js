import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { MovimientoService } from '../../core/services/movimiento.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
function Movimientos_tr_83_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
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
    i0.ɵɵelementStart(8, "td")(9, "span", 34);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 35);
    i0.ɵɵtext(12);
    i0.ɵɵpipe(13, "number");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "td")(15, "button", 36);
    i0.ɵɵlistener("click", function Movimientos_tr_83_Template_button_click_15_listener() { const movimiento_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.eliminarMovimiento(movimiento_r2.id)); });
    i0.ɵɵtext(16, " Eliminar ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const movimiento_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(movimiento_r2.concepto);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(movimiento_r2.categoria);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(7, 15, movimiento_r2.fecha, "dd/MM/yyyy"));
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("etiqueta--ingreso", movimiento_r2.tipo === "Ingreso")("etiqueta--gasto", movimiento_r2.tipo === "Gasto");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", movimiento_r2.tipo, " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ingreso", movimiento_r2.tipo === "Ingreso")("gasto", movimiento_r2.tipo === "Gasto");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" ", movimiento_r2.tipo === "Ingreso" ? "+" : "-", " ", i0.ɵɵpipeBind2(13, 18, movimiento_r2.importe, "1.2-2"), " \u20AC ");
    i0.ɵɵadvance(3);
    i0.ɵɵattribute("aria-label", "Eliminar " + movimiento_r2.concepto);
} }
function Movimientos_tr_84_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 37);
    i0.ɵɵtext(2, " No hay movimientos para mostrar. ");
    i0.ɵɵelementEnd()();
} }
registerLocaleData(localeEs);
export class Movimientos {
    movimientoService = inject(MovimientoService);
    // Lista compartida con Home.
    get movimientos() {
        return this.movimientoService.movimientos();
    }
    // Datos del formulario.
    nuevoConcepto = '';
    nuevaCategoria = 'Otros';
    nuevaFecha = this.obtenerFechaActual();
    nuevoImporte = null;
    nuevoTipo = 'Gasto';
    // Filtro seleccionado.
    filtroTipo = 'Todos';
    /** Devuelve la fecha actual en formato YYYY-MM-DD para el input date. */
    obtenerFechaActual() {
        const hoy = new Date();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${hoy.getFullYear()}-${mes}-${dia}`;
    }
    // Devuelve los movimientos filtrados y ordenados por fecha.
    get movimientosFiltrados() {
        return [...this.movimientos]
            .filter(movimiento => this.filtroTipo === 'Todos' || movimiento.tipo === this.filtroTipo)
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
    // Calcula el número total de movimientos.
    get cantidadMovimientos() {
        return this.movimientos.length;
    }
    // Valida los datos y añade un movimiento al servicio compartido.
    agregarMovimiento() {
        const concepto = this.nuevoConcepto.trim();
        const importe = Number(this.nuevoImporte);
        if (!concepto || !this.nuevaFecha || !Number.isFinite(importe) || importe <= 0) {
            return;
        }
        this.movimientoService.agregarMovimiento({
            concepto,
            categoria: this.nuevaCategoria,
            fecha: this.nuevaFecha,
            importe,
            tipo: this.nuevoTipo
        });
        // Limpiamos el formulario después de guardar.
        this.nuevoConcepto = '';
        this.nuevaCategoria = 'Otros';
        this.nuevaFecha = this.obtenerFechaActual();
        this.nuevoImporte = null;
        this.nuevoTipo = 'Gasto';
        this.filtroTipo = 'Todos';
    }
    // Elimina un movimiento por su identificador.
    eliminarMovimiento(id) {
        this.movimientoService.eliminarMovimiento(id);
    }
    static ɵfac = function Movimientos_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Movimientos)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Movimientos, selectors: [["app-movimientos"]], features: [i0.ɵɵProvidersFeature([{ provide: LOCALE_ID, useValue: 'es-ES' }])], decls: 85, vars: 9, consts: [[1, "movimientos"], [1, "movimientos__bienvenida"], [1, "movimientos__formulario"], [3, "ngSubmit"], [1, "formulario__campos"], [1, "campo"], ["for", "concepto"], ["id", "concepto", "type", "text", "name", "concepto", "placeholder", "Ej. Compra de material", "required", "", 3, "ngModelChange", "ngModel"], ["for", "categoria"], ["id", "categoria", "name", "categoria", 3, "ngModelChange", "ngModel"], ["value", "Trabajo"], ["value", "Vivienda"], ["value", "Alimentaci\u00F3n"], ["value", "Transporte"], ["value", "Suministros"], ["value", "Otros"], ["for", "fecha"], ["id", "fecha", "type", "date", "name", "fecha", "required", "", 3, "ngModelChange", "ngModel"], ["for", "importe"], ["id", "importe", "type", "number", "name", "importe", "min", "0.01", "step", "0.01", "placeholder", "0,00", "required", "", 3, "ngModelChange", "ngModel"], ["for", "tipo"], ["id", "tipo", "name", "tipo", 3, "ngModelChange", "ngModel"], ["value", "Ingreso"], ["value", "Gasto"], ["type", "submit", 1, "boton", "boton--principal"], [1, "movimientos__listado"], [1, "listado__cabecera"], [1, "listado__filtro"], ["for", "filtroTipo"], ["id", "filtroTipo", "name", "filtroTipo", 3, "ngModelChange", "ngModel"], ["value", "Todos"], [1, "tabla-contenedor"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "etiqueta"], [1, "importe"], ["type", "button", 1, "boton-eliminar", 3, "click"], ["colspan", "6", 1, "tabla-vacia"]], template: function Movimientos_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0)(1, "section", 1)(2, "h1");
            i0.ɵɵtext(3, "Movimientos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5, "Consulta y administra tus ingresos y gastos.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "section", 2)(7, "h2");
            i0.ɵɵtext(8, "A\u00F1adir movimiento");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "form", 3);
            i0.ɵɵlistener("ngSubmit", function Movimientos_Template_form_ngSubmit_9_listener() { return ctx.agregarMovimiento(); });
            i0.ɵɵelementStart(10, "div", 4)(11, "div", 5)(12, "label", 6);
            i0.ɵɵtext(13, "Concepto");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "input", 7);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_input_ngModelChange_14_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.nuevoConcepto, $event) || (ctx.nuevoConcepto = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "div", 5)(16, "label", 8);
            i0.ɵɵtext(17, "Categor\u00EDa");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "select", 9);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_select_ngModelChange_18_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.nuevaCategoria, $event) || (ctx.nuevaCategoria = $event); return $event; });
            i0.ɵɵelementStart(19, "option", 10);
            i0.ɵɵtext(20, "Trabajo");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "option", 11);
            i0.ɵɵtext(22, "Vivienda");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "option", 12);
            i0.ɵɵtext(24, "Alimentaci\u00F3n");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "option", 13);
            i0.ɵɵtext(26, "Transporte");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "option", 14);
            i0.ɵɵtext(28, "Suministros");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "option", 15);
            i0.ɵɵtext(30, "Otros");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 5)(32, "label", 16);
            i0.ɵɵtext(33, "Fecha");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "input", 17);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_input_ngModelChange_34_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.nuevaFecha, $event) || (ctx.nuevaFecha = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "div", 5)(36, "label", 18);
            i0.ɵɵtext(37, "Importe (\u20AC)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "input", 19);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_input_ngModelChange_38_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.nuevoImporte, $event) || (ctx.nuevoImporte = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "div", 5)(40, "label", 20);
            i0.ɵɵtext(41, "Tipo de movimiento");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "select", 21);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_select_ngModelChange_42_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.nuevoTipo, $event) || (ctx.nuevoTipo = $event); return $event; });
            i0.ɵɵelementStart(43, "option", 22);
            i0.ɵɵtext(44, "Ingreso");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "option", 23);
            i0.ɵɵtext(46, "Gasto");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(47, "button", 24);
            i0.ɵɵtext(48, " A\u00F1adir movimiento ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(49, "section", 25)(50, "div", 26)(51, "div")(52, "h2");
            i0.ɵɵtext(53, "Listado de movimientos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(54, "p");
            i0.ɵɵtext(55);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(56, "div", 27)(57, "label", 28);
            i0.ɵɵtext(58, "Filtrar:");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "select", 29);
            i0.ɵɵcontrolCreate();
            i0.ɵɵtwoWayListener("ngModelChange", function Movimientos_Template_select_ngModelChange_59_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filtroTipo, $event) || (ctx.filtroTipo = $event); return $event; });
            i0.ɵɵelementStart(60, "option", 30);
            i0.ɵɵtext(61, "Todos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "option", 22);
            i0.ɵɵtext(63, "Ingresos");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(64, "option", 23);
            i0.ɵɵtext(65, "Gastos");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(66, "div", 31)(67, "table")(68, "thead")(69, "tr")(70, "th");
            i0.ɵɵtext(71, "Concepto");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(72, "th");
            i0.ɵɵtext(73, "Categor\u00EDa");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "th");
            i0.ɵɵtext(75, "Fecha");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(76, "th");
            i0.ɵɵtext(77, "Tipo");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(78, "th");
            i0.ɵɵtext(79, "Importe");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(80, "th");
            i0.ɵɵtext(81, "Acciones");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(82, "tbody");
            i0.ɵɵtemplate(83, Movimientos_tr_83_Template, 17, 21, "tr", 32)(84, Movimientos_tr_84_Template, 3, 0, "tr", 33);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(14);
            i0.ɵɵtwoWayProperty("ngModel", ctx.nuevoConcepto);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.nuevaCategoria);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(16);
            i0.ɵɵtwoWayProperty("ngModel", ctx.nuevaFecha);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.nuevoImporte);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.nuevoTipo);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(13);
            i0.ɵɵtextInterpolate1("", ctx.cantidadMovimientos, " movimientos registrados");
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.filtroTipo);
            i0.ɵɵcontrol();
            i0.ɵɵadvance(24);
            i0.ɵɵproperty("ngForOf", ctx.movimientosFiltrados);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.movimientosFiltrados.length === 0);
        } }, dependencies: [CommonModule, i1.NgForOf, i1.NgIf, FormsModule, i2.ɵNgNoValidate, i2.NgSelectOption, i2.ɵNgSelectMultipleOption, i2.DefaultValueAccessor, i2.NumberValueAccessor, i2.SelectControlValueAccessor, i2.NgControlStatus, i2.NgControlStatusGroup, i2.RequiredValidator, i2.MinValidator, i2.NgModel, i2.NgForm, i1.DecimalPipe, i1.DatePipe], styles: [".movimientos[_ngcontent-%COMP%] {\r\n  font-family: 'Segoe UI', sans-serif;\r\n  color: #263238;\r\n  padding: 30px;\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n}\r\n\r\n\r\n.movimientos__bienvenida[_ngcontent-%COMP%] {\r\n  margin-bottom: 30px;\r\n}\r\n\r\n.movimientos__bienvenida[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n  margin-bottom: 8px;\r\n}\r\n\r\n.movimientos__bienvenida[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\r\n  color: #607d8b;\r\n  font-size: 15px;\r\n}\r\n\r\n\r\n.movimientos__formulario[_ngcontent-%COMP%], \r\n.movimientos__listado[_ngcontent-%COMP%] {\r\n  background-color: #ffffff;\r\n  border: 1px solid #e0e0e0;\r\n  border-radius: 10px;\r\n  padding: 24px;\r\n  margin-bottom: 30px;\r\n}\r\n\r\n.movimientos__formulario[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \r\n.movimientos__listado[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n  margin: 0 0 20px;\r\n}\r\n\r\n.formulario__campos[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, 1fr);\r\n  gap: 18px;\r\n  margin-bottom: 22px;\r\n}\r\n\r\n.campo[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 7px;\r\n}\r\n\r\n.campo[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \r\n.listado__filtro[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  color: #455a64;\r\n}\r\n\r\n.campo[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \r\n.campo[_ngcontent-%COMP%]   select[_ngcontent-%COMP%], \r\n.listado__filtro[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\r\n  width: 100%;\r\n  box-sizing: border-box;\r\n  padding: 11px 12px;\r\n  border: 1px solid #cfd8dc;\r\n  border-radius: 7px;\r\n  background-color: #ffffff;\r\n  color: #263238;\r\n  font-family: inherit;\r\n  font-size: 14px;\r\n}\r\n\r\n.campo[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus, \r\n.campo[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus, \r\n.listado__filtro[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\r\n  outline: none;\r\n  border-color: #4788c7;\r\n  box-shadow: 0 0 0 2px rgba(71, 136, 199, 0.12);\r\n}\r\n\r\n\r\n.boton[_ngcontent-%COMP%] {\r\n  border: none;\r\n  border-radius: 7px;\r\n  padding: 12px 18px;\r\n  font-family: inherit;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  cursor: pointer;\r\n  transition: background-color 0.2s;\r\n}\r\n\r\n.boton--principal[_ngcontent-%COMP%] {\r\n  background-color: #315f85;\r\n  color: #ffffff;\r\n}\r\n\r\n.boton--%NS%principal[_ngcontent-%COMP%]:hover {\r\n  background-color: #244967;\r\n}\r\n\r\n\r\n.listado__cabecera[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n.listado__cabecera[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.listado__cabecera[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\r\n  color: #607d8b;\r\n  font-size: 13px;\r\n  margin: 0;\r\n}\r\n\r\n.listado__filtro[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n}\r\n\r\n.listado__filtro[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\r\n  width: auto;\r\n  min-width: 130px;\r\n}\r\n\r\n\r\n.tabla-contenedor[_ngcontent-%COMP%] {\r\n  overflow-x: auto;\r\n}\r\n\r\ntable[_ngcontent-%COMP%] {\r\n  width: 100%;\r\n  min-width: 750px;\r\n  border-collapse: collapse;\r\n  font-size: 14px;\r\n}\r\n\r\nth[_ngcontent-%COMP%], \r\ntd[_ngcontent-%COMP%] {\r\n  padding: 13px 12px;\r\n  text-align: left;\r\n  border-bottom: 1px solid #eeeeee;\r\n}\r\n\r\nth[_ngcontent-%COMP%] {\r\n  background-color: #f5f7f8;\r\n  color: #455a64;\r\n  font-weight: 600;\r\n}\r\n\r\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even) {\r\n  background-color: #f8fafb;\r\n}\r\n\r\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\r\n  background-color: #eef4f8;\r\n}\r\n\r\ntbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:last-child   td[_ngcontent-%COMP%] {\r\n  border-bottom: none;\r\n}\r\n\r\n\r\n.etiqueta[_ngcontent-%COMP%] {\r\n  display: inline-block;\r\n  padding: 5px 9px;\r\n  border-radius: 5px;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n}\r\n\r\n.etiqueta--ingreso[_ngcontent-%COMP%] {\r\n  background-color: #e8f5e9;\r\n  color: #2e7d32;\r\n}\r\n\r\n.etiqueta--gasto[_ngcontent-%COMP%] {\r\n  background-color: #ffebee;\r\n  color: #c62828;\r\n}\r\n\r\n\r\n.importe[_ngcontent-%COMP%] {\r\n  font-weight: 600;\r\n  white-space: nowrap;\r\n}\r\n\r\n.ingreso[_ngcontent-%COMP%] {\r\n  color: #2e7d32;\r\n}\r\n\r\n.gasto[_ngcontent-%COMP%] {\r\n  color: #c62828;\r\n}\r\n\r\n\r\n.boton-eliminar[_ngcontent-%COMP%] {\r\n  border: 1px solid #ef9a9a;\r\n  border-radius: 6px;\r\n  background-color: #ffffff;\r\n  color: #c62828;\r\n  padding: 7px 10px;\r\n  font-family: inherit;\r\n  font-size: 12px;\r\n  cursor: pointer;\r\n}\r\n\r\n.boton-eliminar[_ngcontent-%COMP%]:hover {\r\n  background-color: #ffebee;\r\n}\r\n\r\n\r\n.tabla-vacia[_ngcontent-%COMP%] {\r\n  text-align: center;\r\n  padding: 30px;\r\n  color: #607d8b;\r\n}\r\n\r\n\r\n@media (max-width: 700px) {\r\n  .movimientos[_ngcontent-%COMP%] {\r\n    padding: 20px;\r\n  }\r\n\r\n  .formulario__campos[_ngcontent-%COMP%] {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .listado__cabecera[_ngcontent-%COMP%] {\r\n    align-items: flex-start;\r\n    flex-direction: column;\r\n  }\r\n\r\n  .listado__filtro[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  .movimientos__formulario[_ngcontent-%COMP%], \r\n   .movimientos__listado[_ngcontent-%COMP%] {\r\n    padding: 17px;\r\n  }\r\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Movimientos, [{
        type: Component,
        args: [{ selector: 'app-movimientos', standalone: true, imports: [CommonModule, FormsModule], providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }], template: "\r\n<main class=\"movimientos\">\r\n\r\n  <!-- T\u00EDtulo de la p\u00E1gina -->\r\n  <section class=\"movimientos__bienvenida\">\r\n    <h1>Movimientos</h1>\r\n    <p>Consulta y administra tus ingresos y gastos.</p>\r\n  </section>\r\n\r\n  <!-- Formulario para a\u00F1adir movimientos -->\r\n  <section class=\"movimientos__formulario\">\r\n\r\n    <h2>A\u00F1adir movimiento</h2>\r\n\r\n    <form (ngSubmit)=\"agregarMovimiento()\">\r\n\r\n      <div class=\"formulario__campos\">\r\n\r\n        <div class=\"campo\">\r\n          <label for=\"concepto\">Concepto</label>\r\n          <input\r\n            id=\"concepto\"\r\n            type=\"text\"\r\n            name=\"concepto\"\r\n            [(ngModel)]=\"nuevoConcepto\"\r\n            placeholder=\"Ej. Compra de material\"\r\n            required\r\n          >\r\n        </div>\r\n\r\n        <div class=\"campo\">\r\n          <label for=\"categoria\">Categor\u00EDa</label>\r\n          <select\r\n            id=\"categoria\"\r\n            name=\"categoria\"\r\n            [(ngModel)]=\"nuevaCategoria\"\r\n          >\r\n            <option value=\"Trabajo\">Trabajo</option>\r\n            <option value=\"Vivienda\">Vivienda</option>\r\n            <option value=\"Alimentaci\u00F3n\">Alimentaci\u00F3n</option>\r\n            <option value=\"Transporte\">Transporte</option>\r\n            <option value=\"Suministros\">Suministros</option>\r\n            <option value=\"Otros\">Otros</option>\r\n          </select>\r\n        </div>\r\n\r\n        <div class=\"campo\">\r\n          <label for=\"fecha\">Fecha</label>\r\n          <input\r\n            id=\"fecha\"\r\n            type=\"date\"\r\n            name=\"fecha\"\r\n            [(ngModel)]=\"nuevaFecha\"\r\n            required\r\n          >\r\n        </div>\r\n\r\n        <div class=\"campo\">\r\n          <label for=\"importe\">Importe (\u20AC)</label>\r\n          <input\r\n            id=\"importe\"\r\n            type=\"number\"\r\n            name=\"importe\"\r\n            [(ngModel)]=\"nuevoImporte\"\r\n            min=\"0.01\"\r\n            step=\"0.01\"\r\n            placeholder=\"0,00\"\r\n            required\r\n          >\r\n        </div>\r\n\r\n        <div class=\"campo\">\r\n          <label for=\"tipo\">Tipo de movimiento</label>\r\n          <select\r\n            id=\"tipo\"\r\n            name=\"tipo\"\r\n            [(ngModel)]=\"nuevoTipo\"\r\n          >\r\n            <option value=\"Ingreso\">Ingreso</option>\r\n            <option value=\"Gasto\">Gasto</option>\r\n          </select>\r\n        </div>\r\n\r\n      </div>\r\n\r\n      <button class=\"boton boton--principal\" type=\"submit\">\r\n        A\u00F1adir movimiento\r\n      </button>\r\n\r\n    </form>\r\n\r\n  </section>\r\n\r\n  <!-- Listado de movimientos -->\r\n  <section class=\"movimientos__listado\">\r\n\r\n    <div class=\"listado__cabecera\">\r\n      <div>\r\n        <h2>Listado de movimientos</h2>\r\n        <p>{{ cantidadMovimientos }} movimientos registrados</p>\r\n      </div>\r\n\r\n      <div class=\"listado__filtro\">\r\n        <label for=\"filtroTipo\">Filtrar:</label>\r\n        <select\r\n          id=\"filtroTipo\"\r\n          name=\"filtroTipo\"\r\n          [(ngModel)]=\"filtroTipo\"\r\n        >\r\n          <option value=\"Todos\">Todos</option>\r\n          <option value=\"Ingreso\">Ingresos</option>\r\n          <option value=\"Gasto\">Gastos</option>\r\n        </select>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"tabla-contenedor\">\r\n\r\n      <table>\r\n        <thead>\r\n          <tr>\r\n            <th>Concepto</th>\r\n            <th>Categor\u00EDa</th>\r\n            <th>Fecha</th>\r\n            <th>Tipo</th>\r\n            <th>Importe</th>\r\n            <th>Acciones</th>\r\n          </tr>\r\n        </thead>\r\n\r\n        <tbody>\r\n\r\n          <tr *ngFor=\"let movimiento of movimientosFiltrados\">\r\n\r\n            <td>{{ movimiento.concepto }}</td>\r\n\r\n            <td>{{ movimiento.categoria }}</td>\r\n\r\n            <td>{{ movimiento.fecha | date:'dd/MM/yyyy' }}</td>\r\n\r\n            <td>\r\n              <span\r\n                class=\"etiqueta\"\r\n                [class.etiqueta--ingreso]=\"movimiento.tipo === 'Ingreso'\"\r\n                [class.etiqueta--gasto]=\"movimiento.tipo === 'Gasto'\"\r\n              >\r\n                {{ movimiento.tipo }}\r\n              </span>\r\n            </td>\r\n\r\n            <td\r\n              class=\"importe\"\r\n              [class.ingreso]=\"movimiento.tipo === 'Ingreso'\"\r\n              [class.gasto]=\"movimiento.tipo === 'Gasto'\"\r\n            >\r\n              {{ movimiento.tipo === 'Ingreso' ? '+' : '-' }}\r\n              {{ movimiento.importe | number:'1.2-2' }} \u20AC\r\n            </td>\r\n\r\n            <td>\r\n              <button\r\n                class=\"boton-eliminar\"\r\n                type=\"button\"\r\n                (click)=\"eliminarMovimiento(movimiento.id)\"\r\n                [attr.aria-label]=\"'Eliminar ' + movimiento.concepto\"\r\n              >\r\n                Eliminar\r\n              </button>\r\n            </td>\r\n\r\n          </tr>\r\n\r\n          <tr *ngIf=\"movimientosFiltrados.length === 0\">\r\n            <td colspan=\"6\" class=\"tabla-vacia\">\r\n              No hay movimientos para mostrar.\r\n            </td>\r\n          </tr>\r\n\r\n        </tbody>\r\n      </table>\r\n\r\n    </div>\r\n\r\n  </section>\r\n\r\n</main>\r\n", styles: ["\r\n.movimientos {\r\n  font-family: 'Segoe UI', sans-serif;\r\n  color: #263238;\r\n  padding: 30px;\r\n  max-width: 1200px;\r\n  margin: 0 auto;\r\n}\r\n\r\n/* Bienvenida */\r\n.movimientos__bienvenida {\r\n  margin-bottom: 30px;\r\n}\r\n\r\n.movimientos__bienvenida h1 {\r\n  font-size: 28px;\r\n  margin-bottom: 8px;\r\n}\r\n\r\n.movimientos__bienvenida p {\r\n  color: #607d8b;\r\n  font-size: 15px;\r\n}\r\n\r\n/* Formulario */\r\n.movimientos__formulario,\r\n.movimientos__listado {\r\n  background-color: #ffffff;\r\n  border: 1px solid #e0e0e0;\r\n  border-radius: 10px;\r\n  padding: 24px;\r\n  margin-bottom: 30px;\r\n}\r\n\r\n.movimientos__formulario h2,\r\n.movimientos__listado h2 {\r\n  font-size: 20px;\r\n  margin: 0 0 20px;\r\n}\r\n\r\n.formulario__campos {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, 1fr);\r\n  gap: 18px;\r\n  margin-bottom: 22px;\r\n}\r\n\r\n.campo {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 7px;\r\n}\r\n\r\n.campo label,\r\n.listado__filtro label {\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  color: #455a64;\r\n}\r\n\r\n.campo input,\r\n.campo select,\r\n.listado__filtro select {\r\n  width: 100%;\r\n  box-sizing: border-box;\r\n  padding: 11px 12px;\r\n  border: 1px solid #cfd8dc;\r\n  border-radius: 7px;\r\n  background-color: #ffffff;\r\n  color: #263238;\r\n  font-family: inherit;\r\n  font-size: 14px;\r\n}\r\n\r\n.campo input:focus,\r\n.campo select:focus,\r\n.listado__filtro select:focus {\r\n  outline: none;\r\n  border-color: #4788c7;\r\n  box-shadow: 0 0 0 2px rgba(71, 136, 199, 0.12);\r\n}\r\n\r\n/* Botones */\r\n.boton {\r\n  border: none;\r\n  border-radius: 7px;\r\n  padding: 12px 18px;\r\n  font-family: inherit;\r\n  font-size: 14px;\r\n  font-weight: 600;\r\n  cursor: pointer;\r\n  transition: background-color 0.2s;\r\n}\r\n\r\n.boton--principal {\r\n  background-color: #315f85;\r\n  color: #ffffff;\r\n}\r\n\r\n.boton--principal:hover {\r\n  background-color: #244967;\r\n}\r\n\r\n/* Cabecera del listado */\r\n.listado__cabecera {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 20px;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n.listado__cabecera h2 {\r\n  margin-bottom: 5px;\r\n}\r\n\r\n.listado__cabecera p {\r\n  color: #607d8b;\r\n  font-size: 13px;\r\n  margin: 0;\r\n}\r\n\r\n.listado__filtro {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 10px;\r\n}\r\n\r\n.listado__filtro select {\r\n  width: auto;\r\n  min-width: 130px;\r\n}\r\n\r\n/* Tabla */\r\n.tabla-contenedor {\r\n  overflow-x: auto;\r\n}\r\n\r\ntable {\r\n  width: 100%;\r\n  min-width: 750px;\r\n  border-collapse: collapse;\r\n  font-size: 14px;\r\n}\r\n\r\nth,\r\ntd {\r\n  padding: 13px 12px;\r\n  text-align: left;\r\n  border-bottom: 1px solid #eeeeee;\r\n}\r\n\r\nth {\r\n  background-color: #f5f7f8;\r\n  color: #455a64;\r\n  font-weight: 600;\r\n}\r\n\r\ntbody tr:nth-child(even) {\r\n  background-color: #f8fafb;\r\n}\r\n\r\ntbody tr:hover {\r\n  background-color: #eef4f8;\r\n}\r\n\r\ntbody tr:last-child td {\r\n  border-bottom: none;\r\n}\r\n\r\n/* Etiquetas de tipo */\r\n.etiqueta {\r\n  display: inline-block;\r\n  padding: 5px 9px;\r\n  border-radius: 5px;\r\n  font-size: 12px;\r\n  font-weight: 600;\r\n}\r\n\r\n.etiqueta--ingreso {\r\n  background-color: #e8f5e9;\r\n  color: #2e7d32;\r\n}\r\n\r\n.etiqueta--gasto {\r\n  background-color: #ffebee;\r\n  color: #c62828;\r\n}\r\n\r\n/* Importes */\r\n.importe {\r\n  font-weight: 600;\r\n  white-space: nowrap;\r\n}\r\n\r\n.ingreso {\r\n  color: #2e7d32;\r\n}\r\n\r\n.gasto {\r\n  color: #c62828;\r\n}\r\n\r\n/* Eliminar */\r\n.boton-eliminar {\r\n  border: 1px solid #ef9a9a;\r\n  border-radius: 6px;\r\n  background-color: #ffffff;\r\n  color: #c62828;\r\n  padding: 7px 10px;\r\n  font-family: inherit;\r\n  font-size: 12px;\r\n  cursor: pointer;\r\n}\r\n\r\n.boton-eliminar:hover {\r\n  background-color: #ffebee;\r\n}\r\n\r\n/* Tabla vac\u00EDa */\r\n.tabla-vacia {\r\n  text-align: center;\r\n  padding: 30px;\r\n  color: #607d8b;\r\n}\r\n\r\n/* Adaptaci\u00F3n a m\u00F3viles */\r\n@media (max-width: 700px) {\r\n  .movimientos {\r\n    padding: 20px;\r\n  }\r\n\r\n  .formulario__campos {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .listado__cabecera {\r\n    align-items: flex-start;\r\n    flex-direction: column;\r\n  }\r\n\r\n  .listado__filtro {\r\n    width: 100%;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  .movimientos__formulario,\r\n  .movimientos__listado {\r\n    padding: 17px;\r\n  }\r\n}\r\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Movimientos, { className: "Movimientos", filePath: "src/app/features/movimientos/movimientos.ts", lineNumber: 18 }); })();
