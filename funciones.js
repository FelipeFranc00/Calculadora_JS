document.addEventListener('DOMContentLoaded', function() {
    const pantalla = document.getElementById('pantalla');
    const pantallaResultado = document.getElementById('pantallaResultado');
    const botones = document.querySelectorAll('#teclado button');

    let operacionEnCurso = '';
    let debeLimpiarPantalla = false;

    function limpiarCalculadora() {
        pantalla.value = '0';
        pantallaResultado.value = '0';
        operacionEnCurso = '';
        debeLimpiarPantalla = false;
    }

    function calcularResultado() {
        try {
            // Reemplaza ^ por ** para potencias en JS
            let operacionEval = operacionEnCurso.replace(/\^/g, '**');
            let resultado = eval(operacionEval);
            pantallaResultado.value = resultado;
            pantalla.value = operacionEnCurso + ' =';
            operacionEnCurso = resultado.toString();
            debeLimpiarPantalla = true;
        } catch {
            pantallaResultado.value = 'Error';
        }
    }

    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const valorBoton = boton.textContent;

            // Si es un número o punto
            if (!isNaN(valorBoton) || valorBoton === '.') {
                if (pantalla.value === '0' || debeLimpiarPantalla || pantalla.value.endsWith('=')) {
                    pantalla.value = valorBoton;
                    operacionEnCurso = valorBoton;
                    debeLimpiarPantalla = false;
                } else {
                    pantalla.value += valorBoton;
                    operacionEnCurso += valorBoton;
                }
            }
            // Si es un operador
            else if (['+', '-', '*', '/', '^'].includes(valorBoton)) {
                // Si la pantalla termina en '=', empieza nueva operación con el resultado anterior
                if (pantalla.value.endsWith('=')) {
                    pantalla.value = pantallaResultado.value + valorBoton;
                    operacionEnCurso = pantallaResultado.value + (valorBoton === '^' ? '^' : valorBoton);
                    debeLimpiarPantalla = false;
                } else {
                    pantalla.value += valorBoton;
                    operacionEnCurso += (valorBoton === '^' ? '^' : valorBoton);
                }
            }
            // Si es igual
            else if (valorBoton === '=') {
                calcularResultado();
            }
            // Si es AC (limpiar)
            else if (valorBoton === 'AC') {
                limpiarCalculadora();
            }
            // Si es porcentaje
            else if (valorBoton === '%') {
                // Convierte el último número en porcentaje
                let match = operacionEnCurso.match(/(\d+\.?\d*)$/);
                if (match) {
                    let num = parseFloat(match[1]) / 100;
                    operacionEnCurso = operacionEnCurso.replace(/(\d+\.?\d*)$/, num);
                    pantalla.value = operacionEnCurso;
                }
            }
        });
    });
});