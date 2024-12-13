const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const alertContainer = document.getElementById('alert-container');


function showAlert(message) {
    alertContainer.innerHTML = `
        <div class="custom-alert">
            <div class="alert-content">
                ${message}
                <button type="button" class="close-alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    `;
    document.querySelector('.close-alert').onclick = () => {
        alertContainer.innerHTML = '';
    };
}

startBtn.onclick = () => {
    // Obtener los datos del formulario
    const nombre = document.querySelector('input[placeholder="Nombre"]').value;
    const rut = document.querySelector('input[placeholder="Rut"]').value;
    const correo = document.querySelector('input[placeholder="Correo"]').value;
    const telefono = document.querySelector('input[placeholder="Telefono"]').value;
    const colegio = document.querySelector('input[placeholder="Colegio"]').value;

    // Validar que todos los campos estén llenos
    if (!nombre) {
        showAlert('Debes ingresar tu nombre.');
        return;
    }
    if (!rut) {
        showAlert('Debes ingresar tu Rut.');
        return;
    }

    const rutRegex = /^\d{8,9}$/; //Verificar que el Rut contenga solo 8 o 9 dígitos
    if (!rutRegex.test(rut)) {
        showAlert('El Rut debe tener entre 8 y 9 dígitos.');
        return;
    }
    if (!correo) {
        showAlert('Debes ingresar tu Correo.');
        return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Verificar que el correo tenga un formato válido Valido
    if (!correoRegex.test(correo)) {
        showAlert('Por favor, ingrese un correo electrónico válido.');
        return;
    }
    if (!telefono) {
        showAlert('Debes ingresar tu numero de Teléfono.');
        return;
    }
    // Validar que el teléfono tenga exactamente 9 dígitos
    const telefonoRegex = /^\d{9}$/;
    if (!telefonoRegex.test(telefono)) {
        showAlert('El Telefono debe tener 9 dígitos.');
        return;
    }
    if (!colegio) {
        showAlert('Debes ingresar el nombre de tu colegio.');
        return;
    }

    popupInfo.classList.add('active');
    main.classList.add('active');
}




exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
}

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();
}

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    showQuestions(questionCount);
    questionCounter(questionNumb);
}


let questionCount = 0;
let questionNumb = 1;
let userScore = 0;

const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');
const questionTotal = document.querySelector('.question-total');

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);

        questionNumb++;
        questionCounter(questionNumb);

        nextBtn.classList.remove('active');
    }
    else {
        showResultBox();
    }
}


function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
        <div class="option"><span>${questions[index].options[1]}</span></div>
        <div class="option"><span>${questions[index].options[2]}</span></div>
        <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}

function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].classList.add('correct');
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
}

function questionCounter(index) {
    questionTotal.textContent = `${index} de ${questions.length} preguntas`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Tu puntaje: ${userScore} de ${questions.length}`;

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = Math.round((userScore / questions.length) * 100);
    let speed = 20;

    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#4d5bf9 ${progressStartValue * 3.6}deg, #cadcff ${progressStartValue * 3.6}deg)`;

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}