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
    const respuesta = await fetch('https://random-word-api.herokuapp.com/word?number=1&lang=es&length=${longitud}'); 
    //la variable longitud la coge de la variable longitud que se pasa (getElementbyid selectletras y seugun las letras busca palabra cn esas letras)
    const datuak = await respuesta.json; 
    return datos[0].toUpperCase(); 

  } catch (error) { //si no funciona error
    console.error("Error API:", error);
    return null; // Devuelve null si no hay conexión o falla la API
  }

};  

const jugar = () => { 
  const intentos = document.getElementById('selectIntentos').value; // seleciona los intentos 
  const letras = document.getElementById('selectLetras').value; // selecciona las letras  

  const palabra = await obtenerPalabraAPI(letras); //PEDIR LA PALABRA 

  // si FALLA LA API

  if (!palabra) {
    alert("Ezin izan da hitza lortu. Saiatu berriro! / No se pudo obtener la palabra de la API. ¡Inténtalo de nuevo!");
    return; // Se corta aquí y no cambia la pantalla
  }
  //---------------SI LA API FUNCIONA------------------

  palabraAdivinar = palabra;
  console.log("Palabra secreta cargada:", palabraSecreta);

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
      const casilla = document.createElement('input');
      casilla.type = 'text';
      casilla.maxLength = 1;
      casilla.className = 'casilla';
      fila.appendChild(casilla);
    }

    tablero.appendChild(fila);
  }


  // 3. Generar el teclado birtuala
  const CrearTeclado= () =>{
    const teklatua = document.getElementById('teklatua'); //crear la constante de teklado 
        teklatua.innerHTML = '';
        
  const filas = [
  ['Q','W','E','R','T','Y','U','I','O','P'], 
  ['A','S','D','F','G','H','J','K','L','Ñ'],
  ['INTRO','Z','X','C','V','B','N','M','DEL']
  ]; 


  }
 


  teclas.forEach(letra => {
    const boton = document.createElement('button');
    boton.textContent = letra;
    boton.className = 'tecla';
    teklatua.appendChild(boton);
  });
document.getElementById('btnJugar').addEventListener('click', jugar);



}
