document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('#teclado button');
    const historial = document.getElementById('historial');
    const pantalla = document.getElementById('num_pantalla');
    
    // Variables para guardar los números y operaciones
    let operacionesHistorial = []; 
    let primerNumero = '';
    let operacionActual = '';
    let segundoNumero = '';
    let debeLimpiarPantalla = false;

    // Funciones de porcentaje
    function restarPorcentaje(numero, porcentaje) {
        const valorPorcentaje = (numero * porcentaje) / 100;
        return numero - valorPorcentaje;
    }

    function sumarPorcentaje(numero, porcentaje) {
        const valorPorcentaje = (numero * porcentaje) / 100;
        return numero + valorPorcentaje;
    }

    function multiplicarPorPorcentaje(numero, porcentaje) {
        return (numero * porcentaje) / 100;
    }

    function dividirPorPorcentaje(numero, porcentaje) {
        return (numero * 100) / porcentaje;
    }

    // Función para determinar el tipo de operación con porcentaje
    function operacionConPorcentaje(numero, porcentaje, operacionPrevia) {
        switch(operacionPrevia) {
            case '+':
                return sumarPorcentaje(numero, porcentaje);
            case '-':
                return restarPorcentaje(numero, porcentaje);
            case '*':
                return multiplicarPorPorcentaje(numero, porcentaje);
            case '/':
                return dividirPorPorcentaje(numero, porcentaje);
            default:
                // Si no hay operación previa, devuelve el porcentaje del número
                return multiplicarPorPorcentaje(numero, porcentaje);
        }
    }

    // Función para actualizar la pantalla
    function actualizarPantalla(valor) {
        if (pantalla.value === '0' || debeLimpiarPantalla) {
            pantalla.value = valor;
            debeLimpiarPantalla = false;
        } else {
            pantalla.value += valor;
        }
    }

    //Funcion para actualizar historial
    function actualizarHistorial(){
        historial.innerHTML = operacionesHistorial.slice(-10).join('<br>');
    }
        

        
        // Función para realizar cálculos
    function calcularResultado() {
        const num1 = parseFloat(primerNumero);
        const num2 = parseFloat(pantalla.value);
        let resultado = 0;
        let expresionCompleta = '';
        
        switch (operacionActual) {
            case '+':
                resultado = num1 + num2;
                expresionCompleta = `${primerNumero} + ${pantalla.value}`;
                break;
            case '-':
                resultado = num1 - num2;
                expresionCompleta = `${primerNumero} - ${pantalla.value}`;
                break;
            case '*':
                resultado = num1 * num2;
                expresionCompleta = `${primerNumero} × ${pantalla.value}`;
                break;
            case '/':
                if (num2 !== 0) {
                    resultado = num1 / num2;
                    expresionCompleta = `${primerNumero} ÷ ${pantalla.value}`;
                } else {
                    resultado = 'Error';
                    expresionCompleta = `${primerNumero} ÷ ${pantalla.value}`;
                }
            
            case '^':
                resultado = num1 ** num2;
                expresionCompleta = `${primerNumero} ^ ${pantalla.value}`;
                break;
            case '%':
                // Aquí implementamos la lógica del porcentaje
                resultado = operacionConPorcentaje(num1, num2, operacionAnterior);
            
                
            // Construir la expresión según el contexto
                if (operacionAnterior) {
                    switch(operacionAnterior) {
                        case '+':
                            expresionCompleta = `${primerNumero} + ${pantalla.value}%`;
                            break;
                        case '-':
                            expresionCompleta = `${primerNumero} - ${pantalla.value}%`;
                            break;
                        case '*':
                            expresionCompleta = `${primerNumero} × ${pantalla.value}%`;
                            break;
                        case '/':
                            expresionCompleta = `${primerNumero} ÷ ${pantalla.value}%`;
                            break;
                        
                    }
                } else {
                    expresionCompleta = `${pantalla.value}% de ${primerNumero}`;
                }
                break;
                    
                    
            default:
                return;
        }
        
        if (resultado !== 'Error') {
            // Redondear a 8 decimales para evitar errores de precisión
            resultado = Math.round(resultado * 100000000) / 100000000;
        }
        
        pantalla.value = resultado;
        primerNumero = resultado.toString();
        operacionActual = '';
        debeLimpiarPantalla = true;
        historial.textContent = `${expresionCompleta} = ${resultado}`;
        operacionesHistorial.push(`${expresionCompleta} = ${resultado}`);
        actualizarHistorial();    
    }

    // Variable para recordar la operación anterior al porcentaje
    let operacionAnterior = '';
    
    // Función para limpiar todo
    function limpiarCalculadora() {
        pantalla.value = '0';
        primerNumero = '';
        segundoNumero = '';
        operacionActual = '';
        operacionAnterior = '';
        debeLimpiarPantalla = false;
        historial.textContent = '';
    }

    // Eventos para cada botón
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const valorBoton = boton.textContent;
            
            // Si es un número (0-9) o punto decimal
            if (!isNaN(valorBoton) || valorBoton === '.') {
                actualizarPantalla(valorBoton);
            }
            
            // Si es un operador (+, -, *, /, ^)
            else if (['+', '-', '*', '/', '^'].includes(valorBoton)) {
                if (operacionActual !== '') {
                    calcularResultado();
                }
                
                primerNumero = pantalla.value;
                operacionActual = valorBoton;
                operacionAnterior = valorBoton; // Guardar para uso con porcentaje
                debeLimpiarPantalla = true;
            }
            
            // Si es el operador de porcentaje (%)
            else if (valorBoton === '%') {
                if (primerNumero !== '') {
                    // Si ya hay un primer número y una operación
                    operacionActual = '%';
                    debeLimpiarPantalla = true;
                } else {
                    // Si solo queremos calcular el porcentaje del número actual
                    const numeroActual = parseFloat(pantalla.value);
                    const resultado = numeroActual / 100;
                    pantalla.value = resultado;
                    historial.textContent = `${numeroActual}% = ${resultado}`;
                    debeLimpiarPantalla = true;
                }
            }
            
            // Si es igual (=)
            else if (valorBoton === '=') {
                if (operacionActual !== '') {
                    calcularResultado();
                }
            }
            
            // Si es AC (limpiar)
            else if (valorBoton === 'AC') {
                limpiarCalculadora();
            }
            // Si es +/-
            else if(valorBoton==='+/-'){
                let valorActual = parseFloat(pantalla.value);
                if(valorActual!==0){
                    valorActual =valorActual * -1;
                    pantalla.value = valorActual;   
                }
            }
        });
    });
});