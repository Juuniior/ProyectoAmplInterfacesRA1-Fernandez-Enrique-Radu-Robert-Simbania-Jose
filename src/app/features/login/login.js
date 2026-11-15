import { Component } from '@angular/core';
import * as i0 from "@angular/core";
function Login_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "form", 4)(1, "label", 5);
    i0.ɵɵtext(2, " Correo electr\u00F3nico ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElement(3, "input", 6);
    i0.ɵɵdomElementStart(4, "label", 7);
    i0.ɵɵtext(5, " Contrase\u00F1a ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElement(6, "input", 8);
    i0.ɵɵdomElementStart(7, "a", 9);
    i0.ɵɵtext(8, " \u00BFHas olvidado tu contrase\u00F1a? ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "button", 10);
    i0.ɵɵtext(10, " Entrar ");
    i0.ɵɵdomElementEnd()();
} }
function Login_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "form", 4)(1, "label", 11);
    i0.ɵɵtext(2, " Nombre completo ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElement(3, "input", 12);
    i0.ɵɵdomElementStart(4, "label", 13);
    i0.ɵɵtext(5, " Correo electr\u00F3nico ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElement(6, "input", 14);
    i0.ɵɵdomElementStart(7, "label", 15);
    i0.ɵɵtext(8, " Contrase\u00F1a ");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElement(9, "input", 16);
    i0.ɵɵdomElementStart(10, "button", 10);
    i0.ɵɵtext(11, " Crear cuenta ");
    i0.ɵɵdomElementEnd()();
} }
export class Login {
    modo = 'login';
    cambiarModo(modo) {
        this.modo = modo;
    }
    static ɵfac = function Login_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Login)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Login, selectors: [["app-login"]], decls: 9, vars: 6, consts: [[1, "acceso"], [1, "acceso__tarjeta"], ["role", "tablist", 1, "acceso__pesta\u00F1as"], ["type", "button", 1, "acceso__pesta\u00F1a", 3, "click"], [1, "acceso__formulario"], ["for", "login-email", 1, "acceso__etiqueta"], ["id", "login-email", "type", "email", "placeholder", "tucorreo@ejemplo.com", 1, "acceso__campo"], ["for", "login-password", 1, "acceso__etiqueta"], ["id", "login-password", "type", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "acceso__campo"], ["aria-disabled", "true", "tabindex", "-1", 1, "acceso__enlace-secundario"], ["type", "submit", "disabled", "", 1, "acceso__boton"], ["for", "registro-nombre", 1, "acceso__etiqueta"], ["id", "registro-nombre", "type", "text", "placeholder", "Nombre y apellidos", 1, "acceso__campo"], ["for", "registro-email", 1, "acceso__etiqueta"], ["id", "registro-email", "type", "email", "placeholder", "tucorreo@ejemplo.com", 1, "acceso__campo"], ["for", "registro-password", 1, "acceso__etiqueta"], ["id", "registro-password", "type", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "acceso__campo"]], template: function Login_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "main", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
            i0.ɵɵdomListener("click", function Login_Template_button_click_3_listener() { return ctx.cambiarModo("login"); });
            i0.ɵɵtext(4, " Iniciar sesi\u00F3n ");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "button", 3);
            i0.ɵɵdomListener("click", function Login_Template_button_click_5_listener() { return ctx.cambiarModo("registro"); });
            i0.ɵɵtext(6, " Registrarse ");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵconditionalCreate(7, Login_Conditional_7_Template, 11, 0, "form", 4);
            i0.ɵɵconditionalCreate(8, Login_Conditional_8_Template, 12, 0, "form", 4);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("acceso__pesta\u00F1a--activa", ctx.modo === "login");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("acceso__pesta\u00F1a--activa", ctx.modo === "registro");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.modo === "login" ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.modo === "registro" ? 8 : -1);
        } }, styles: [".acceso[_ngcontent-%COMP%] {\n --%NS%color-texto: #232620;\n --%NS%color-texto-suave: #6d6f68;\n --%NS%color-fondo: #ffffff;\n --%NS%color-fondo-suave: #f6f8f6;\n --%NS%color-borde: #e4e3df;\n --%NS%color-acento: #3f5c4e;\n --%NS%color-acento-suave: #eef1ee;\n font-family: 'Segoe UI', system-ui, sans-serif;\n color: var(--%NS%color-texto);\n display: flex;\n justify-content: center;\n padding: 56px 16px;\n background-color: var(--%NS%color-fondo-suave);\n min-height: 480px;\n}\n.acceso__tarjeta[_ngcontent-%COMP%] {\n    width: 100%;\n max-width: 380px;\n background-color: var(--%NS%color-fondo);\n border: 1px solid var(--%NS%color-borde);\n border-radius: 12px;\n padding: 8px;\n}\n.acceso__pesta\u00F1as[_ngcontent-%COMP%] {\n display: flex;\n gap: 4px;\n padding: 8px;\n margin-bottom: 8px;\n}\n.acceso__pesta\u00F1a[_ngcontent-%COMP%] {\n flex: 1;\n border: none;\n background: none;\n font-size: 14px;\n font-weight: 600;\n color: var(--%NS%color-texto-suave);\n padding: 10px;\n border-radius: 8px;\n cursor: pointer;\n}\n.acceso__pesta\u00F1a--activa[_ngcontent-%COMP%] {\n background-color: var(--%NS%color-acento-suave);\n color: var(--%NS%color-acento);\n}\n.acceso__formulario[_ngcontent-%COMP%] {\n    display: flex;\n flex-direction: column;\n gap: 6px;\n padding: 16px 20px 24px;\n}\n.acceso__etiqueta[_ngcontent-%COMP%] {\n font-size: 13px;\n font-weight: 600;\n margin-top: 10px;\n}\n.acceso__campo[_ngcontent-%COMP%] {\n font-size: 14px;\n padding: 10px 12px;\n border: 1px solid var(--%NS%color-borde);\n border-radius: 8px;\n font-family: inherit;\n}\n.acceso__campo[_ngcontent-%COMP%]:focus {\n outline: none;\n border-color: var(--%NS%color-acento);\n}\n.acceso__enlace-secundario[_ngcontent-%COMP%] {\n font-size: 12px;\n color: var(--%NS%color-texto-suave);\n text-decoration: none;\n margin-top: 6px;\n cursor: not-allowed;\n pointer-events: none;\n}\n.acceso__boton[_ngcontent-%COMP%] {\n margin-top: 18px;\n background-color: var(--%NS%color-acento);\n color: #ffffff;\n border: none;\n border-radius: 8px;\n font-size: 14px;\n font-weight: 600;\n padding: 12px;\n cursor: not-allowed;\n opacity: 0.6;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Login, [{
        type: Component,
        args: [{ selector: 'app-login', standalone: true, imports: [], template: "<main class=\"acceso\">\n  <div class=\"acceso__tarjeta\">\n\n    <div class=\"acceso__pesta\u00F1as\" role=\"tablist\">\n\n      <button\n        type=\"button\"\n        class=\"acceso__pesta\u00F1a\"\n        [class.acceso__pesta\u00F1a--activa]=\"modo === 'login'\"\n        (click)=\"cambiarModo('login')\">\n        Iniciar sesi\u00F3n\n      </button>\n\n      <button\n        type=\"button\"\n        class=\"acceso__pesta\u00F1a\"\n        [class.acceso__pesta\u00F1a--activa]=\"modo === 'registro'\"\n        (click)=\"cambiarModo('registro')\">\n        Registrarse\n      </button>\n\n    </div>\n\n    @if (modo === 'login') {\n      <form class=\"acceso__formulario\">\n\n        <label class=\"acceso__etiqueta\" for=\"login-email\">\n          Correo electr\u00F3nico\n        </label>\n\n        <input\n          class=\"acceso__campo\"\n          id=\"login-email\"\n          type=\"email\"\n          placeholder=\"tucorreo@ejemplo.com\">\n\n        <label class=\"acceso__etiqueta\" for=\"login-password\">\n          Contrase\u00F1a\n        </label>\n\n        <input\n          class=\"acceso__campo\"\n          id=\"login-password\"\n          type=\"password\"\n          placeholder=\"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\">\n\n        <a\n          class=\"acceso__enlace-secundario\"\n          aria-disabled=\"true\"\n          tabindex=\"-1\">\n          \u00BFHas olvidado tu contrase\u00F1a?\n        </a>\n\n        <button\n          type=\"submit\"\n          class=\"acceso__boton\"\n          disabled>\n          Entrar\n        </button>\n\n      </form>\n    }\n\n    @if (modo === 'registro') {\n      <form class=\"acceso__formulario\">\n\n        <label class=\"acceso__etiqueta\" for=\"registro-nombre\">\n          Nombre completo\n        </label>\n\n        <input\n          class=\"acceso__campo\"\n          id=\"registro-nombre\"\n          type=\"text\"\n          placeholder=\"Nombre y apellidos\">\n\n        <label class=\"acceso__etiqueta\" for=\"registro-email\">\n          Correo electr\u00F3nico\n        </label>\n\n        <input\n          class=\"acceso__campo\"\n          id=\"registro-email\"\n          type=\"email\"\n          placeholder=\"tucorreo@ejemplo.com\">\n\n        <label class=\"acceso__etiqueta\" for=\"registro-password\">\n          Contrase\u00F1a\n        </label>\n\n        <input\n          class=\"acceso__campo\"\n          id=\"registro-password\"\n          type=\"password\"\n          placeholder=\"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\">\n\n        <button\n          type=\"submit\"\n          class=\"acceso__boton\"\n          disabled>\n          Crear cuenta\n        </button>\n\n      </form>\n    }\n\n  </div>\n</main>", styles: [".acceso {\n --color-texto: #232620;\n --color-texto-suave: #6d6f68;\n --color-fondo: #ffffff;\n --color-fondo-suave: #f6f8f6;\n --color-borde: #e4e3df;\n --color-acento: #3f5c4e;\n --color-acento-suave: #eef1ee;\n font-family: 'Segoe UI', system-ui, sans-serif;\n color: var(--color-texto);\n display: flex;\n justify-content: center;\n padding: 56px 16px;\n background-color: var(--color-fondo-suave);\n min-height: 480px;\n}\n.acceso__tarjeta {\n    width: 100%;\n max-width: 380px;\n background-color: var(--color-fondo);\n border: 1px solid var(--color-borde);\n border-radius: 12px;\n padding: 8px;\n}\n.acceso__pesta\u00F1as {\n display: flex;\n gap: 4px;\n padding: 8px;\n margin-bottom: 8px;\n}\n.acceso__pesta\u00F1a {\n flex: 1;\n border: none;\n background: none;\n font-size: 14px;\n font-weight: 600;\n color: var(--color-texto-suave);\n padding: 10px;\n border-radius: 8px;\n cursor: pointer;\n}\n.acceso__pesta\u00F1a--activa {\n background-color: var(--color-acento-suave);\n color: var(--color-acento);\n}\n.acceso__formulario {\n    display: flex;\n flex-direction: column;\n gap: 6px;\n padding: 16px 20px 24px;\n}\n.acceso__etiqueta {\n font-size: 13px;\n font-weight: 600;\n margin-top: 10px;\n}\n.acceso__campo {\n font-size: 14px;\n padding: 10px 12px;\n border: 1px solid var(--color-borde);\n border-radius: 8px;\n font-family: inherit;\n}\n.acceso__campo:focus {\n outline: none;\n border-color: var(--color-acento);\n}\n.acceso__enlace-secundario {\n font-size: 12px;\n color: var(--color-texto-suave);\n text-decoration: none;\n margin-top: 6px;\n cursor: not-allowed;\n pointer-events: none;\n}\n.acceso__boton {\n margin-top: 18px;\n background-color: var(--color-acento);\n color: #ffffff;\n border: none;\n border-radius: 8px;\n font-size: 14px;\n font-weight: 600;\n padding: 12px;\n cursor: not-allowed;\n opacity: 0.6;\n}"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Login, { className: "Login", filePath: "src/app/features/login/login.ts", lineNumber: 10 }); })();
