let palabraAdivinar= ''; //para DECLARAR VARIABLES QUE VAN A CAMBIAR DE VALOR DURANTE EL JUEGO
let maxIntentos = 0;
let longitudLetras = 0;
let filaActual = 0;
let columnaActual = 0;
let intentosRealizados = [];
let juegoTerminado = false;


// --------------- PALABRA A TRAVES DE LA API---------------
const obtenerPalabra = async (longitud) => { //declarar variables que solo van a volver a reasignarse
  //ASYNC PARA EVITAR QUE SE CONGELE LA PAGINA --> QUE REQUIERE RED(BUSCAR LA PALABRA)
  try { //para ejecutar la API
   const respuesta = await fetch(`https://words-api-sy2x.onrender.com/api/word?lang=es&length=${longitud}&number=1`);
    //la variable longitud la coge de la variable longitud que se pasa (getElementbyid selectletras y seugun las letras busca palabra cn esas letras)
    const datuak = await respuesta.json(); 
    return datuak[0].toUpperCase(); 

  } catch (error) { //si no funciona error
    console.error("Error API:", error);
    return null; // Devuelve null si no hay conexión o falla la API
  }

};  

// --------------- INICIAR LA PARTIDA ---------------

const jugar = async () => { //crea la variable jugar que coje los valores de intentos y letras
  const intentos = document.getElementById('selectIntentos').value; // seleciona los intentos 
  const letras = document.getElementById('selectLetras').value; // selecciona las letras  

  const palabra = await obtenerPalabra(letras); //PEDIR LA PALABRA 

  // ------------- SI FALLA LA API -----------------

  if (!palabra) {
    alert("Ezin izan da hitza lortu. Saiatu berriro! / No se pudo obtener la palabra de la API. ¡Inténtalo de nuevo!");
    return; // Se corta aquí y no cambia la pantalla
  }

  //---------------SI LA API FUNCIONA------------------

  palabraAdivinar = palabra;

  maxIntentos = parseInt(intentos);
  longitudLetras = parseInt(letras);
  filaActual = 0;
  columnaActual = 0;
  intentosRealizados = [];
  juegoTerminado = false;

  console.log("Palabra secreta cargada:", palabraAdivinar);

  //ocultar y mostrar el juego

  document.getElementById('formulario').style.display = 'none'; // el formulario
  document.getElementById('joko-eremua').style.display = 'block'; // el juegoi


  //tablero
  const tablero = document.getElementById('tablero');
  tablero.innerHTML = '';


  //------------------LAS FILAS, HACIA ABAJO -----------------------------
  for (let i = 0; i < intentos; i++) { //segun cuantos intentos marques cuantas filas
    const fila = document.createElement('div');
    fila.className = 'fila';

 //------------------TAMAÑO DE LA PALABRA, HACIA LOS LADOS -----------------------------
    for (let j = 0; j < letras; j++) { 
      const casilla = document.createElement('div');
      casilla.type = 'text';
      casilla.maxLength = 1;
      casilla.className = 'casilla';

      casilla.id = `casilla-${i}-${j}`;

      fila.appendChild(casilla); //
    }

    tablero.appendChild(fila);
  }


 // ---------------------- TEKLADO VIRTUAL ----------------------
    const teklatua = document.getElementById('teklatua'); //crear la constante de teklado 
        teklatua.innerHTML = '';
        
  const filas = [
  ['Q','W','E','R','T','Y','U','I','O','P'], 
  ['A','S','D','F','G','H','J','K','L','Ñ'],
  ['INTRO','Z','X','C','V','B','N','M','DEL']
  ]; 

 // Recorremos las filas del teclado
  filas.forEach(filaTeclas => {
    const filaDiv = document.createElement('div'); //crrea el div y crea una constanste filaDiv
    filaDiv.className = 'teklatua-lerroa'; // es como el <div class="..." le pone la clase teklatu lerroa>

    filaTeclas.forEach(letra => { // por cada letra --- la variable de antes
      const boton = document.createElement('button'); // crear la tecla como variable boton
      boton.className = 'tecla';
      boton.textContent = letra;
      boton.setAttribute('data-key', letra);//le da a boton la letra tecla
      filaDiv.appendChild(boton); // meter el boton dentro de la fila
      boton.addEventListener('click', () => procesarEntrada(letra)); // el listener para que las teclas virtuales funcionen al hacer clic con el ratón
      filaDiv.appendChild(boton);
    });

    teklatua.appendChild(filaDiv); // meter la fila dentro de teklatua
  });
}; 




//---------------------- TECLADO FISICO -----------------------
const TecladoFisico = (e) => { // declarar el teclado fisico
  if (juegoTerminado) return; 
  if (e.key === "Enter") procesarEntrada('INTRO'); // e.key sirve para guardar el nombre de la tecla.   //  === ENTER comprueba si hemos pulsado enter en teclado // PROCESARENTRADA es para que le pase la palabra intro COMO SI HUBIERAMOS TECLEADO EN EL VIRTUAL
  else if (e.key === 'Backspace' || e.key === 'Delete') procesarEntrada('DEL'); // POR SI PULSAS BORRAR HACIA ATRAS O EL DELETE
  else if (/^[a-zA-ZñÑ]$/.test(e.key)) procesarEntrada(e.key.toUpperCase()); //FILTRO DE SEGURIDAD PARA IGNORAR NUMEROS
  //.test(e.key): Comprueba si la tecla pulsada cumple el patrón. 
  // Si pulsas la letra a, da true; si pulsas un número como el 5 o la barra espaciadora, da false y lo ignora. e.key.ToupperCase convierte en mayus. 
}

//------------------ ESCRIBIR Y BORRAR -------------------
const procesarEntrada = (tecla)=> {
  if (juegoTerminado) return; 

  if (tecla === 'DEL'){
    if (columnaActual > 0) { //si no hay ninguna letra no pasa nada
      columnaActual--;  
      document.getElementById(`casilla-${filaActual}-${columnaActual}`).textContent = ''; //le dice qen que casilla fila y columna esta y le borra lo que tenga dentro para ponerle nada de valor

    }
  }
      else if (tecla === 'INTRO') { 
        if (columnaActual === longitudLetras) {
          comprobarFila(); // la variable que comprueba si el texto esta bien
          }
        }

      else if (columnaActual < longitudLetras && tecla.length === 1) { // si estas en la columna 5 para que ya no te deje escribir mas tecla.lengh si el caracter solo tiene 1 o mas ('a')
        document.getElementById(`casilla-${filaActual}-${columnaActual}`).textContent = tecla; // la ubicacion esacta de casilla fila y columna y text.content pone la letra dentro del cuadradp
        columnaActual++;   // pasa de columna
      }
    }
// ----------------------- COMPROBAR LOS INTENTOS ------------------------
const comprobarFila = () => {
  let intento = ''; 
  for (let i=0; i<longitudLetras; i++){ // bucle para recorrer de izq a derecha todas las letras y juntar palabra 
    const casilla = document.getElementById(`casilla-${filaActual}-${i}`); //busca casilla y la fila que estas y la i va cambiando segun avance de casilla
    intento += casilla.textContent; 
  }

  intentosRealizados.push(intento) // Guardamos el intento en el historia

  let letrasSecretas = palabraAdivinar.split('');  
  //split corta letra por letra. LetrasSecretas guarda las letras una por una de la variable de la palabra del resultado ya cortada. --> 'GATO'--> 'G''A''T''O'; 

  let resultado = []; //lista vacia para guardar los colores de cada casilla 

// ----------------------------------------------------
  // 1. PASO: BUSCAR VERDES ('ok') - Posición exacta
  // ----------------------------------------------------
  
  for (let i= 0; i< longitudLetras; i++) {
    if (intento[i] === palabraAdivinar[i] ) {
      //la i coje la letra del intento que es la palabra que ponemos la compara con la palabra que tiene que adivinar y si es la misma es 'si''no''si'no'si'
      resultado[i] = 'ok'; //marca 'ok' en la casilla que este bien la letra con la palabra que tenia que adivinar
      letrasSecretas[i] = null; //tachamos la pakabr
    }  
    else {
      resultado[i] = 'no' //gris PORQUE LA LETRA NO ESTA EN LA MISMA POSICIIN QUEPALABRAADIVINAR

    }
  }

  // ----------------------------------------------------
  // 2. PASO: BUSCAR AMARILLOS ('existe') - Está pero en otro sitio
  // ----------------------------------------------------

  for (let i=0; i<longitudLetras; i++){
    if (resultado[i] !== 'ok') { //si la casilla no es verde 
      const posicionesSecretas = letrasSecretas.indexOf(intento[i]); //indexOf--> BUSCA SI ALGUNA LETRA DE intento[i] esta en letrasSecretas. La guarda en la constante posicionesSecretas

      if (posicionesSecretas !== -1){ // si la palabra esta entre [0 , ?] es que esta dentro y se marca amarilla
        resultado[i] = 'existe'; //marca que la letra existe
        letrasSecretas[posicionesSecretas] = null; //tacha esa letra en la lista secreta poniéndole un null
      }
    }
  }

  // ----------------------------------------------------
  // 3 PASO: PINTAR LOS COLORES EN EL TABLERO Y EL TECLADO
  // ----------------------------------------------------
  for (let i =0; i<longitudLetras; i++ ){
    const casilla = document.getElementById(`casilla-${filaActual}-${i}`);
    const color = resultado[i]; //sera 'Ok' 'no' o 'existe'; 

    casilla.classList.add(color);

    //pintar tambien la letra en el teclado virtual 
    const teclaVirtual = document.querySelector(`.tecla[data-key="${intento[i]}"]`); //EXPLICAR

    if (teclaVirtual) {
      if (color === 'ok') { //verde
        teclaVirtual.className = 'tecla ok';
      } 
      else if (color === 'existe' && !teclaVirtual.classList.contains('ok')) { //amarillo
        teclaVirtual.className = 'tecla existe';
      } 
      else if (color === 'no' && !teclaVirtual.classList.contains('ok') && !teclaVirtual.classList.contains('existe')) { //blanco
        teclaVirtual.className = 'tecla no';
      }
    }
  }
  // ----------------------------------------------------
  // 4 PASO: COMPROBAR SI HA GANADO, PERDIDO O SIGUE JUGANDO
  // ----------------------------------------------------
  

  if (intento === palabraAdivinar) {
    finalizarPartida(true); //ha ganado
  } else if (filaActual === maxIntentos - 1) { //// Ha llegado a la última fila y ha fallado
    finalizarPartida(false); 
  } else {
    filaActual++; // Baja a la siguiente fila
    columnaActual = 0; //se coloca en la priemra letra de una mas abajo
  }
};

// --------------- FINALIZAR Y GUARDAR HISTORIAL ---------------

const finalizarPartida = (victoria) => {
  juegoTerminado = true;
  document.removeEventListener('keydown', TecladoFisico);

  const partida = {
    hitza: palabraAdivinar,
    saiakerak: intentosRealizados,
    data: new Date().toLocaleString(),
    irabazi: victoria
  };

  // Guardar en localStorage (últimas 10)
  let historial = JSON.parse(localStorage.getItem('wordle_historial')) || [];
  historial.unshift(partida);
  historial = historial.slice(0, 10);
  localStorage.setItem('wordle_historial', JSON.stringify(historial));

  // Pantalla final
  document.getElementById('joko-eremua').style.display = 'none';
  const historiaDiv = document.getElementById('historia');
  const resultadoTitulo = document.getElementById('resultado-titulo');
  const zerrenda = document.getElementById('historia-zerrenda');

  resultadoTitulo.textContent = victoria ? 'Irabazi duzu!' : `Galduta! (Hitza: ${palabraAdivinar})`;
  zerrenda.innerHTML = '';

  historial.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'partida-item';
    item.innerHTML = `
      <strong>#${idx + 1} ${p.irabazi ? ' Irabazita' : ' Galduta'}</strong><br>
      Hitza: <b>${p.hitza}</b> | Saiakerak: ${p.saiakerak.length}<br>
      <small>${p.data}</small>
    `;
    zerrenda.appendChild(item);
  });

  historiaDiv.style.display = 'block';
};

//El addEventListener va fuera de la función jugar al final del todo
document.getElementById('btnJugar').addEventListener('click', jugar);
document.getElementById('btnBerriro').addEventListener('click', () => location.reload());
window.addEventListener('keydown', TecladoFisico); // Escuchar las teclas del teclado físico