class Color{
    constructor(id,r,g,b,contenedor){
        this.id = id;
        this.rgb = [r,g,b];
        this.DOM = null;
        this.crearColor(contenedor);
    }
    crearColor(contenedor){
        this.DOM = document.createElement("li");
        this.DOM.innerHTML = `<span>${this.rgb.join(",")}</span>`;
        this.DOM.style.backgroundColor = `rgb(${this.rgb.join(",")})`;

        let botonEditar = document.createElement("button");
        botonEditar.innerText = "editar";

        botonEditar.addEventListener("click", () => {
            colorEditar = this;
            previewColor.style.backgroundColor= `rgb(${colorEditar.rgb.join(",")})`;

            colorEditar.rgb.forEach((valor,i) => {
                rgbTemporal[i] = valor;
                controlesEditor[i].value = valor;
            })

            modalEditar.classList.add("modal-visible");
        });

        let botonBorrar = document.createElement("button");
        botonBorrar.innerText = "borrar";

        botonBorrar.addEventListener("click", () => {
            colorBorrar = this;
            modalBorrar.classList.add("modal-visible"); 
        });

        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        contenedor.appendChild(this.DOM);
    }
    borrarColor(){
        fetch("/colores/borrar/" + this.id, {
            method : "DELETE"
        })
        .then( respuesta => {
            if(respuesta.status == 204){
                this.DOM.remove();
                colorBorrar = null;
                return modalBorrar.classList.remove("modal-visible");
            }
            console.log("feedback al usuario de que hubo un error")
            //si no se entra a la base, feedback al usuario de que hubo un error
        });
    }
    actualizarColor(rgbTemporal){
        let valido = false;

        let i = 0;

        while(!valido && i < 3){
            valido = this.rgb[i] != rgbTemporal[i];
            i++;
        }

        if(valido){
            let [r,g,b] = rgbTemporal;
            return fetch("/colores/actualizar/" + this.id, {
                method : "PATCH",
                body : JSON.stringify({r,g,b}),
                headers : {
                    "Content-type" : "application/json"
                }
            })
            .then( respuesta => {
                if(respuesta.status == 204){
                    rgbTemporal.forEach((valor,i) => {
                        colorEditar.rgb[i] = valor;
                        rgbTemporal[i] = 0;
                    });
                    colorEditar.DOM.style.backgroundColor = `rgb(${colorEditar.rgb.join(",")})`;
                    colorEditar.DOM.children[0].innerText = colorEditar.rgb.join(",");
                    colorEditar = null;
                    return modalEditar.classList.remove("modal-visible");
                }
                console.log("informar al usuario del error");
            });
        }

        colorEditar = null;
        rgbTemporal.forEach((valor,i) => rgbTemporal[i] = 0);
        modalEditar.classList.remove("modal-visible");
    }
}