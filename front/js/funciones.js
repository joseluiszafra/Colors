const contenedorColores = document.querySelector("ul");
const modalBorrar = document.querySelector(".modal-borrar");
const botonesBorrar = modalBorrar.querySelectorAll("button");
const modalEditar = document.querySelector(".modal-editar");
const botonesEditar = modalEditar.querySelectorAll("button");
const form = document.querySelector("form");
const inputText = form.querySelector('input[type="text"]');
const msgError = form.querySelector(".error");
const previewColor = modalEditar.querySelector(".color");
const controlesEditor = modalEditar.querySelectorAll('input[type="range"]');

let colorBorrar = null;
let colorEditar = null;
let rgbTemporal = [0,0,0];

fetch("/colores")
.then( respuesta => respuesta.json())
.then( colores => {
    colores.forEach( color => {
        let {_id,r,g,b} = color;

        new Color(_id,r,g,b,contenedorColores);
    });
});

form.addEventListener("submit", e => {
    e.preventDefault();
    msgError.classList.remove("visible");
    if(/^([0-9]{1,3},){2}[0-9]{1,3}$/.test(inputText.value)){
        let valores = inputText.value.split(",").map( n => Number(n));
        let valido = true;

        let i = 0;

        while(valido && i < 3){
            valido = valores[i] <= 255;
            i++
        }

        if(valido){

            let [r,g,b] = valores;

            return fetch("/colores/nuevo", {
                method : "POST",
                body : JSON.stringify({r,g,b}),
                headers :{
                    "Content-type" : "application/json"
                }
            })
            .then( respuesta => {
                if(respuesta.status == 201){
                    return respuesta.json()
                }
                throw "mostrar error al usuario";
            })
            .then( respuesta => {
                new Color(respuesta.id,r,g,b,contenedorColores);
                inputText.value = "";
            })
            .catch( e => {
                console.log(e);
            });
        }
    }

    msgError.classList.add("visible");
})

botonesBorrar.forEach((boton,i) => {
    boton.addEventListener("click",() => {
        if(i == 0){
            return colorBorrar.borrarColor();
        }
        //esto es si cancelamos
        colorBorrar = null;
        modalBorrar.classList.remove("modal-visible");
    })
})

botonesEditar.forEach((boton,i) => {
    boton.addEventListener("click",() => {
        if(i == 0){
            return colorEditar.actualizarColor(rgbTemporal);
        }
        //esto es si cancelamos
        colorEditar = null;
        rgbTemporal.forEach((valor,i) => rgbTemporal[i] = 0);
        modalEditar.classList.remove("modal-visible");
    })
})

controlesEditor.forEach((control,i) => {
    control.addEventListener("input", () => {
        rgbTemporal[i] = Number(control.value);
        previewColor.style.backgroundColor = `rgb(${rgbTemporal.join(",")})`
    }); 
});