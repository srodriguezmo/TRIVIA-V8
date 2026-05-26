// app.js
let estActual = 1; 
let rondActual = 0;
let preguntasEstacionActual = [];
let bloqueandoOpciones = false;

const nombresEstaciones = {
    1: "Estación 1: Nivel Básico",
    2: "Estación 2: Nivel Intermedio",
    3: "Estación 3: Nivel Avanzado"
};

function mezclarArreglo(arreglo) {
    for (let i = arreglo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
    }
    return arreglo;
}

function cambiarPantalla(idPantalla) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(idPantalla).classList.add('active');
}

function iniciarJuego() {
    estActual = 1;
    prepararEstacion();
    cambiarPantalla('screen-quiz');
}

function prepararEstacion() {
    rondActual = 0;
    
    let bloqueEstacion = bancoPorNiveles.find(b => b.estacion === estActual);
    let filtradas = bloqueEstacion ? bloqueEstacion.preguntas : [];
    
    let todasLasDeLaEstacion = filtradas.map(p => {
        let textoGanador = "";
        if (p.correcta === "Opción A") textoGanador = p.opcionA;
        if (p.correcta === "Opción B") textoGanador = p.opcionB;
        if (p.correcta === "Opción C") textoGanador = p.opcionC;

        return {
            pregunta: p.enunciado,
            opciones: [p.opcionA, p.opcionB, p.opcionC].filter(o => o !== undefined && o !== ""),
            correctaText: textoGanador
        };
    });

    // Barajamos las 27 preguntas completas de la estación actual
    mezclarArreglo(todasLasDeLaEstacion);
    
    // Extraemos de forma exacta 3 preguntas al azar para la ronda
    preguntasEstacionActual = todasLasDeLaEstacion.slice(0, 3);
    
    cargarPregunta();
}

function cargarPregunta() {
    bloqueandoOpciones = false;
    document.getElementById("feedback").innerText = "";
    
    const dataPregunta = preguntasEstacionActual[rondActual];

    document.getElementById("station-tag").innerText = nombresEstaciones[estActual];
    document.getElementById("question").innerText = dataPregunta.pregunta;
    
    for (let i = 0; i < 3; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.className = "dot";
        if (i < rondActual) dot.classList.add("correct");
        else if (i === rondActual) dot.classList.add("active");
    }

    let opcionesMezcladas = [...dataPregunta.opciones];
    mezclarArreglo(opcionesMezcladas);

    const contenedorOpciones = document.getElementById("options");
    contenedorOpciones.innerHTML = "";

    opcionesMezcladas.forEach((opcion) => {
        const boton = document.createElement("button");
        boton.className = "option-btn";
        boton.innerText = opcion;
        boton.onclick = (e) => procesarRespuesta(opcion, e.target);
        contenedorOpciones.appendChild(boton);
    });
}

function procesarRespuesta(opcionSeleccionada, botonElemento) {
    if (bloqueandoOpciones) return;
    bloqueandoOpciones = true;

    const respuestaCorrectaText = preguntasEstacionActual[rondActual].correctaText;
    const feedbackDiv = document.getElementById("feedback");

    if (opcionSeleccionada === respuestaCorrectaText) {
        botonElemento.classList.add("success-blink");
        feedbackDiv.innerText = "¡Excelente! Respuesta correcta.";
        feedbackDiv.style.color = "#28a745";

        setTimeout(() => {
            rondActual++;
            if (rondActual > 2) {
                estActual++;
                if (estActual > 3) {
                    mostrarPantallaVictoriaFinal();
                } else {
                    prepararEstacion();
                }
            } else {
                cargarPregunta();
            }
        }, 1200);

    } else {
        botonElemento.classList.add("error-blink");
        feedbackDiv.innerText = "Incorrecto. Se seleccionarán 3 preguntas nuevas de este nivel...";
        feedbackDiv.style.color = "#dc3545";

        document.querySelectorAll(".option-btn").forEach(btn => {
            if (btn.innerText === respuestaCorrectaText) {
                btn.classList.add("success-blink");
            }
        });

        setTimeout(() => {
            prepararEstacion(); 
        }, 2500);
    }
}

function mostrarPantallaVictoriaFinal() {
    document.querySelector('.game-container').style.display = 'none';
    document.getElementById('final-victory-screen').style.display = 'flex';
}

function entregarPremio() {
    const finalVictory = document.getElementById('final-victory-screen');
    if(!document.getElementById('incentivo-tag')) {
        const aviso = document.createElement('div');
        aviso.id = "incentivo-tag";
        aviso.innerText = "🎁 ¡Código de Premio Confirmado! Acércate con los organizadores de la Subdirección.";
        aviso.style.color = "#ffcc00";
        aviso.style.marginTop = "25px";
        aviso.style.fontSize = "1.3rem";
        aviso.style.fontWeight = "bold";
        finalVictory.appendChild(aviso);
    }
}