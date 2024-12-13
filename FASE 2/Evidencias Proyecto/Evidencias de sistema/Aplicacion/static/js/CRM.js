/*Carga de Json*/
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayData();
    /*Funciones de filtrado*/    
    // Añadir eventos de clic a los botones de filtro
    document.querySelectorAll('.tag-bar2 .tag').forEach(button => {
        button.addEventListener('click', (event) => {
            const sortType = event.target.getAttribute('data-sort');
            filterData(sortType);
        });
    });

    document.querySelectorAll('.send-email-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const email = event.target.getAttribute('data-email');
            if (email) {
                console.log(`Enviar correo a: ${email}`);
                sendEmail(email);
            } else {
                console.error('No se pudo obtener el correo electrónico');
            }
        });
    });

    document.getElementById('filter-school-btn').addEventListener('click', () => {
        filterBySchool();
    });

     // Añadir evento al botón de generar Excel
    // Añadir evento al botón de generar Excel
    document.querySelector('.btn-generar-excel').addEventListener('click', function(event) {
        event.preventDefault();
        generarExcelDesdeDatos();
    });
    const schoolInput = document.getElementById('school-input');
    const suggestionsList = document.getElementById('suggestions');

    schoolInput.addEventListener('input', function() {
        const query = schoolInput.value;
        if (query.length > 0) {
            fetch(`/completar_colegios/?term=${query}`) 
                .then(response => response.json())
                .then(data => {
                    suggestionsList.innerHTML = '';
                    data.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        li.addEventListener('click', function() {
                            schoolInput.value = item;
                            suggestionsList.innerHTML = '';
                            filterBySchool(); // Filtra los datos al seleccionar una sugerencia
                        });
                        suggestionsList.appendChild(li);
                    });
                })
                .catch(error => console.error('Error al obtener los colegios:', error));
        } else {
            suggestionsList.innerHTML = '';
        }
    });

    document.addEventListener('click', function(event) {
        if (!suggestionsList.contains(event.target) && event.target !== schoolInput) {
            suggestionsList.innerHTML = '';
        }
    });


});

let myChart; // Variable global para mantener la referencia al gráfico


function fetchAndDisplayData() {
    fetch('/obtener-datos-cuestionario/')
        .then(response => response.json())
        .then(data => {
            window.tableData = data; // Guarda los datos en una variable global
            displayTable(data);
            createGraph(data);
        })
        .catch(error => console.error('Error al obtener los datos:', error));
}

function displayTable(data) {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = ''; // Limpia la tabla antes de agregar nuevas filas

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.rut}</td>
            <td>+56${item.telefono}</td>
            <td class="${item.puntaje < 50 ? 'low-score' : ''}">${item.puntaje}%</td>
            <td>${item.colegio}</td>
            ${item.puntaje < 50 ? `<td><button class="send-email-btn" data-email="${item.correo}" data-nombre="${item.nombre}" data-puntaje="${item.puntaje}">Enviar correo</button></td>` : '<td></td>'}
            <td><button class="delete-btn" data-id="${item.rut}" data-nombre="${item.nombre}">Eliminar</button></td>

        `;
        tbody.appendChild(row);
    });

    // Añadir evento de clic a los botones de enviar correo
    document.querySelectorAll('.send-email-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const email = event.target.getAttribute('data-email');
            const nombre = event.target.getAttribute('data-nombre');
            const puntaje = event.target.getAttribute('data-puntaje');
            if (email && nombre && puntaje) {
                if (puntaje < 50) {
                    console.log(`Enviar correo a: ${email}, Nombre: ${nombre}, Puntaje: ${puntaje}`);
                    sendEmail(email, nombre, puntaje);
                } else {
                    console.log(`No se envía correo a: ${email}, Nombre: ${nombre}, Puntaje: ${puntaje} (Puntaje >= 50)`);
                }
            } else {
                console.error('No se pudo obtener el correo electrónico, nombre o puntaje');
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const rut = event.target.getAttribute('data-id');
            const nombre = event.target.getAttribute('data-nombre');
            if (rut) {
                console.log(`Eliminar alumno con rut: ${rut}`);
                eliminar(rut,nombre);
            } else {
                console.error('No se pudo obtener el rut del alumno');
            }
        });
    });

    console.log('Table displayed with data:', data);
}

function sendEmail(email, nombre, puntaje) {
    fetch('/envio/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')  // Asegúrate de incluir el token CSRF
        },
        body: new URLSearchParams({
            'email': email,
            'nombre': nombre,
            'puntaje': puntaje
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Correo enviado con éxito');
        } else {
            alert('Error al enviar el correo');
        }
    })
    .catch(error => console.error('Error:', error));
}

function eliminar(rut, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Estás seguro de que deseas eliminar al alumno: ${nombre}? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/eliminar-alumno/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')  // Asegúrate de incluir el token CSRF
                },
                body: new URLSearchParams({
                    'rut': rut
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire(
                        'Eliminado',
                        'El registro ha sido eliminado con éxito.',
                        'success'
                    );
                    fetchAndDisplayData(); // Actualiza la tabla después de eliminar el registro
                } else {
                    Swal.fire(
                        'Error',
                        'Hubo un error al eliminar el registro: ' + data.message,
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire(
                    'Error',
                    'Hubo un error al eliminar el registro.',
                    'error'
                );
            });
        } else {
            console.log('Eliminación cancelada');
        }
    });
}

function createGraph(data) {
    const totalAlumnos = data.length;
    const alumnosBajo50 = data.filter(item => item.puntaje < 50).length;
    const porcentajeBajo50 = (alumnosBajo50 / totalAlumnos) * 100;
    const porcentajeSobre50 = 100 - porcentajeBajo50;

    // Destruye el gráfico existente si existe
    if (myChart) {
        myChart.destroy();
    }

    // Crea el gráfico
    // Crea el gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Reprobados', 'Aprobados'],
            datasets: [{
                data: [porcentajeBajo50.toFixed(1), porcentajeSobre50.toFixed(1)], // Formatea los datos con un solo decimal
                backgroundColor: ['#C35138', '#72e31a'],
                hoverBackgroundColor: ['#C35138', '#72e31a'],
                color: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#FFFFFF' // Cambia el color de las etiquetas de la leyenda
                    }
                },
                title: {
                    display: true,
                    text: 'Porcentaje de alumnos con puntajes por debajo del 50%',
                    color: '#FFFFFF'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.raw !== null) {
                                label += Number(context.raw).toFixed(1) + '%'; // Convierte a número y formatea el valor con un solo decimal
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}



// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function filterData(sortType) {
    let filteredData;
    if (sortType === 'lowScore') {
        filteredData = window.tableData.filter(item => item.puntaje < 50);
        // Destruye el gráfico existente si existe
        if (myChart) {
            myChart.destroy();
        }
        displayTable(filteredData);
    } else if (sortType === 'highScore') {
        filteredData = window.tableData.filter(item => item.puntaje >= 50);
        if (myChart) {
            myChart.destroy();
        }
        displayTable(filteredData);
    } else {
        filteredData = window.tableData;
        displayTable(filteredData);
        createGraph(filteredData);
    }
}

// Filtro de escuelas
const filterBySchool = () => {
    const schoolInput = document.getElementById('school-input').value.toLowerCase();
    if (schoolInput === '') {
        displayTable(window.tableData); // Muestra todos los datos si no hay nada escrito
        createGraph(window.tableData); // Actualiza el gráfico
    } else {
        const filteredData = window.tableData.filter(item => item.colegio.toLowerCase() === schoolInput);
        displayTable(filteredData); // Muestra los datos filtrados
        createGraph(filteredData); // Actualiza el gráfico
    }
    console.log('Table filtered by school:', schoolInput);
}

function generarExcelDesdeDatos() {
    const rows = Array.from(document.querySelectorAll('.data-table tbody tr'));
    const data = rows.map(row => {
        return {
            nombre: row.cells[0].innerText,
            rut: row.cells[1].innerText,
            telefono: row.cells[2].innerText,
            puntaje: row.cells[3].innerText,
            colegio: row.cells[4].innerText
        };
    });

    fetch('/generar-excel-desde-datos/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Error al generar el archivo Excel');
        }
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ReporteBecaFacil.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error:', error));
}