
//Funcion Para generar una sugerencia de los nombres de colegios desde la base de datos
document.addEventListener('DOMContentLoaded', function() {
    const colegioInput = document.querySelector('input[placeholder="Colegio"]'); //Selecciona el el input con el placeholder "Colegio"
    const sugerencias = document.createElement('div'); //Crea un div para las sugerencias
    sugerencias.classList.add('suggestions-box'); //Añade la clase "suggestions-box" al div de sugerencias
    colegioInput.parentNode.appendChild(sugerencias); //Añade el div de sugerencias al padre del input

    colegioInput.addEventListener('input', function() { //Añade un evento de input  que verifica que se ingresaron más de 2 caracteres
        const query = colegioInput.value;   //Obtiene el valor del input de colegio
        if (query.length > 1) { //Verifica que se ingresaron más de 2 caracteres
            fetch(`/completar_colegios/?term=${query}`) //Hace una petición GET a la URL /completar_colegios/ con el query como parámetro
                .then(response => response.json())  //Convierte la respuesta a JSON
                .then(data => {
                    sugerencias.innerHTML = '';  //Limpia el div de sugerencias
                    data.forEach(item => { //Por cada item en la respuesta
                        const colegioSugerido = document.createElement('div'); //Crea un div para la sugerencia
                        colegioSugerido.classList.add('suggestion-item'); //Añade la clase "suggestion-item" al div de sugerencia
                        colegioSugerido.textContent = item; //Añade el item como texto al div de sugerencia
                        colegioSugerido.addEventListener('click', function() { //Añade un evento de click a la sugerencia
                            colegioInput.value = item; //Al hacer click en la sugerencia, se  añade el texto al input de colegio
                            sugerencias.innerHTML = ''; //Limpia el div de sugerencias
                        });
                        sugerencias.appendChild(colegioSugerido); //Añade el  sugerencia al div de sugerencias
                    });
                });
        } else {
            sugerencias.innerHTML = ''; //Si no se ingresaron más de 2 caracteres, se limpia el div de sugerencias
        }
    });

    document.querySelector('.start-btn').addEventListener('click', function(event) { //Añade un evento de click al botón de inicio
        event.preventDefault();
        
        // Obtener los datos del formulario
        const nombre = document.querySelector('input[placeholder="Nombre"]').value; //Obtiene el valor del input de nombre
        const rutInput = document.querySelector('input[placeholder="Rut"]');
        let rut = rutInput.value; // Obtiene el valor del input de rut

        // Añade un guion antes del último dígito
        if (rut.length > 1) {
            rut = rut.slice(0, -1) + '-' + rut.slice(-1);
        }

        rutInput.value = rut;
        const correo = document.querySelector('input[placeholder="Correo"]').value; //Obtiene el valor del input de correo
        const telefono = document.querySelector('input[placeholder="Telefono"]').value; //Obtiene el valor del input de telefono
        const colegio = document.querySelector('input[placeholder="Colegio"]').value; //Obtiene el valor del input de colegio

        // Crear un objeto con los datos del formulario
        const registroData = {
            nombre: nombre,
            rut: rut,
            correo: correo,
            telefono: telefono,
            colegio: colegio,
            puntaje: 0
        };
        // Transformar DATOS
        
        // Almacenar el objeto en localStorage
        localStorage.setItem('registroData', JSON.stringify(registroData)); //Convierte el objeto a JSON y lo almacena en localStorage
    });

    document.querySelector('.goHome-btn').addEventListener('click', function(event) {
        event.preventDefault();

        // Recuperar los datos del registro desde localStorage
        const registroData = JSON.parse(localStorage.getItem('registroData'));

        // Obtener el valor de progress-value
        const progressValue = document.querySelector('.progress-value').innerText;

        // Convertir el valor de progress-value a un número entero
        const progressValueInt = parseInt(progressValue.replace('%', ''), 10);

        // Actualizar las respuestas y el puntaje en registroData
        registroData.puntaje = progressValueInt; // Añadir el valor de progress-value como número entero

        // Enviar los datos al servidor
        fetch('/guardar/', {
            method: 'POST', //Hace una petición POST a la URL /guardar/
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(registroData) //Envía los datos del registro como JSON
        }).then(response => {
            if (response.ok) {
                window.location.href = 'cuestionario'; //Redirige a la página de cuestionario
            } else {
                response.json().then(data => {
                    alert('Error al guardar el cuestionario: ' + data.error);
                });
            }
        });
    });
});

function getCookie(name) { //Función para obtener una cookie por su nombre
    let cookieValue = null; //Inicializa la cookie como nula
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';'); //Separa las cookies por punto y coma
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim(); //Elimina los espacios en blanco al inicio y al final de la cookie
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); //Decodifica la cookie
                break;
            }
        }
    }
    return cookieValue; //Retorna el valor de la cookie
}