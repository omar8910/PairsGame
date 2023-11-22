window.onload = () => {
    arrayFrutas = ["coconut", "coconut", "grape", "grape", "lemon", "lemon", "pineapple", "pineapple", "strawberry", "strawberry"];
    cartasGiradas = [];
    parejasEncontradas = [];
    iniciado = false;
    
    cartasReferencia = generarCartas(arrayFrutas);
    for(img of document.getElementsByTagName("img")){
        img.addEventListener("dragstart", (e) => { // Para que no se pueda arrastrar la imagen.
            e.preventDefault();
        });
    }
    for (carta of document.getElementsByClassName("carta_volteada_trasera")) {
        carta.children[0].src = `./img/${cartasReferencia[parseInt(carta.children[0].id)]}_card.png`; // Utilizo parseInt para que el id de la carta sea un numero y coincida con un indice del array.
    }
    cartas = document.getElementsByTagName("img");
    document.addEventListener('dblclick',(e)=>{
        e.preventDefault();
        e.stopPropagation();
    })
    for(carta of cartas){
        carta.addEventListener("click", clickCarta);
    }
}

function generarCartas(arrayFrutas) {
    return arrayFrutas.sort(() => Math.random() - 0.5);
}

function mostrarCarta(carta) {
    carta.children[0].classList.add("carta");

}

function ocultarCarta(carta) {
    carta.children[0].classList.remove("carta");
}

function desactivarClickCarta(carta) {
    carta.removeEventListener("click", clickCarta, false);
}

function clickActivadoCarta(carta) {
    carta.addEventListener("click", clickCarta);
}



function iniciarCronometro() {
    intervalo = setInterval(() => {
        segundos = document.getElementById("segundos");
        minutos = document.getElementById("minutos");
        formateoSegundos = parseInt(segundos.innerHTML);
        formateoMinutos = parseInt(minutos.innerHTML);
        if (formateoSegundos < 59) {
            if (formateoSegundos < 9) {
                segundos.innerHTML = "0" + (++formateoSegundos);
            } else {
                segundos.innerHTML++;
            }
        } else {
            segundos.innerHTML = "00";
            if (formateoMinutos < 59) {
                if (formateoMinutos < 9) {
                    minutos.innerHTML = "0" + (++formateoMinutos);
                } else {
                    minutos.innerHTML++;
                }
            }
        }
    }, 1000);
    iniciado = true;
}

function clickCarta(e) {
    if (!iniciado) {
        iniciarCronometro();
    }
    carta = document.getElementById(e.target.id);
    if (!(cartasGiradas.includes(carta))) {
        cartasGiradas.push(carta);
    }
    desactivarClickCarta(carta.children[0].children[1].children[0]);
    mostrarCarta(carta);
    if (cartasGiradas.length == 2) {
        for (carta of cartas) {
            desactivarClickCarta(carta);
        }
        comprobarCartas();
        setTimeout(() => {
            for (carta of cartas) {
                clickActivadoCarta(carta);
            }

            for (carta of parejasEncontradas) {
                carta.children[0].children[1].children[0].removeEventListener('click', clickCarta, false) // Lo mismo necesitamos otro parametro.
            }
        }, 1000);

    }
}

function comprobarCartas() {
    for (carta of cartas) {
        desactivarClickCarta(carta);
    }
    if(cartasGiradas[0].children[0].children[1].children[0].src != cartasGiradas[1].children[0].children[1].children[0].src){
        setTimeout(() => {
            ocultarCarta(cartasGiradas[0]);
            ocultarCarta(cartasGiradas[1]);
            cartasGiradas = [];
        },1000)

    }else{
        parejasEncontradas.push(...cartasGiradas);
        if(parejasEncontradas.length == 10){
            window.clearInterval(intervalo);
            intervalo = null;
            setTimeout(() => {
                for(carta of document.getElementsByClassName("carta_volteada")){
                    carta.style.opacity = 1;
                }
            victoriaH2 = document.getElementById("victoria");
            victoriaH2.textContent = "Enhorabuena, has ganado!";
            resetearDiv = document.getElementById("resetear");
            resetearBoton = document.createElement("button");
            resetearBoton.innerHTML = "Jugar otra vez";
            resetearBoton.addEventListener("click", () =>{
                location.reload(); // Metodo de la API de window que recarga la pagina.
            })
            resetearDiv.appendChild(resetearBoton);
            
            }, 1000);
        }else{
            setTimeout(() => {
                cartasGiradas = [];

            }, 1500);
            setTimeout(() => {
                cartasGiradas[0].style.opacity = 0;
                cartasGiradas[1].style.opacity = 0;
            }, 1200);

        }
    }
}

