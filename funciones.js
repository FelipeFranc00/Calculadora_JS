document.addEventListener('DOMContentLoaded', function() {
    const pantalla = document.getElementById('pantalla');
    const botones = document.querySelectorAll('#teclado button');
    const pantallaResultado = document.getElementById('pantallaResultado');
    // Variables para guardar los números y operaciones
    let primerNumero = '';
    let operacionActual = '';
    let debeLimpiarPantalla = false;
    let operacionEnCurso = '';
    

    // Función para actualizar la pantalla
    function actualizarPantalla(valor) {
        if (pantalla.value === '0' || debeLimpiarPantalla) {
            pantalla.value = valor;
            debeLimpiarPantalla = false;
        } else {
            pantalla.value += valor;
        }
    }

    // Función para realizar cálculos
function calcularResultado() {
    const num1 = parseFloat(primerNumero);
    const num2 = parseFloat(pantalla.value);
    let resultado = 0;
    
    switch (operacionActual) {
        case '+':
            resultado = num1 + num2;
            break;
        case '-':
            resultado = num1 - num2;
            break;
        case '*':
            resultado = num1 * num2;
            break;
        case '/':
            resultado = num2 !== 0 ? num1 / num2 : 'Error';
            break;
        case '^':
            resultado = num1 ** num2;
            break;
        default:
            return;
    }
    pantalla.value = resultado; // <-- Actualiza la pantalla principal
    pantallaResultado.value = resultado;
    primerNumero = resultado.toString();
    operacionActual = '';
    debeLimpiarPantalla = true;
}
                
                

                

    // Función para limpiar todo
    function limpiarCalculadora() {
        pantalla.value = '0';
        pantallaResultado.value='0'
        primerNumero = '';
        segundoNumero = '';
        operacionActual = '';
        debeLimpiarPantalla = false;
    }

    // Eventos para cada botón
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const valorBoton = boton.textContent;
            
            // Si es un número (0-9)
            if (!isNaN(valorBoton) || valorBoton === '.') {
                actualizarPantalla(valorBoton);
            }
            
            // Si es un operador (+, -, *, /)
            else if (['+', '-', '*', '/','^'].includes(valorBoton)) {
                if (operacionActual !== '') {
                    calcularResultado();
                }
                
                    
                
                primerNumero = pantalla.value;
                operacionActual = valorBoton;
                debeLimpiarPantalla = true;
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
        });
    });
});