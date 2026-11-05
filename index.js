import dotenv from "dotenv";
dotenv.config();//cargar las variables de entorno desde el .env
//--------------------------
import express from "express";
import {leerColores,crearColor,borrarColor,actualizarColor} from "./db.js";

const servidor = express();

servidor.use(express.json());

servidor.use(express.static("./front"))

servidor.get("/colores", async (peticion,respuesta) => {
    try{

        let colores = await leerColores();

        respuesta.json(colores);

    }catch(e){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"});
    }
});

servidor.post("/colores/nuevo", async (peticion,respuesta,siguiente) => {
    
    let {r,g,b} = peticion.body;

    //validaciones
    let valido = true;

    [r,g,b].forEach( n => {
        valido = valido && /^[0-9]{1,3}$/.test(n) && Number(n) <= 255;
    });

    if(!valido){
        return siguiente(true);
    }


    try{

        let id = await crearColor({r,g,b});
        respuesta.status(201);
        respuesta.json({id});

    }catch(e){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"});
    }
});

servidor.delete("/colores/borrar/:id", async (peticion,respuesta,siguiente) => {
    
    let {id} = peticion.params;

    //validaciones
    if(!/^[a-f0-9]{24}$/.test(id)){
        return siguiente();
    }

    try{

        let cantidad = await borrarColor(id);
        
        if(cantidad){
            return respuesta.sendStatus(204);
        }
        
        siguiente();

    }catch(e){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"});
    }
});

servidor.patch("/colores/actualizar/:id", async (peticion,respuesta,siguiente) => {
    
    let {id} = peticion.params;

    if(!/^[a-f0-9]{24}$/.test(id)){
        return siguiente();
    }
    
    let {r,g,b} = peticion.body;
    let valido = r != undefined || g != undefined || b != undefined;
    
    if(!valido){
        return siguiente(true);
    }
    
    let objCambios = {};
    let claves = ["r","g","b"];

    [r,g,b].forEach( (n,i) => {
        if(n != undefined){
            valido = valido && /^[0-9]{1,3}$/.test(n) && Number(n) <= 255;
            if(valido){
                objCambios[claves[i]] = n;
            }
        }
    })

    if(!valido){
        return siguiente(true);
    }

    try{

        let {matchedCount} = await actualizarColor(id,objCambios);

        if(matchedCount){
            return respuesta.sendStatus(204);
        }
        siguiente();

    }catch(e){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"});
    }
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.sendStatus(400);
});

servidor.use((peticion,respuesta) => {
    respuesta.sendStatus(404);
});

servidor.listen(process.env.PORT);