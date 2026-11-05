import dotenv from "dotenv";
dotenv.config();//cargar las variables de entorno desde el .env
//--------------------------
import { MongoClient, ObjectId } from "mongodb";

function conectar(){
    return MongoClient.connect(process.env.MONGO_URL);
}

export function leerColores(){
   return new Promise((ok,ko) => {
        let conexion = null;

        conectar()
        .then( conexionMongodb => {
            conexion = conexionMongodb;
            
            let coleccion = conexion.db("colores").collection("colores");

            return coleccion.find({}).toArray();
        })
        .then( colores => ok(colores))
        .catch( error => ko({ error : "error en la bbdd" }))
        .finally(() => {
            if(conexion){
                conexion.close();
            }
        });
   }); 
}

export function crearColor(objColor){ //{r,g,b}
   return new Promise((ok,ko) => {
        let conexion = null;

        conectar()
        .then( conexionMongodb => {
            conexion = conexionMongodb;
            
            let coleccion = conexion.db("colores").collection("colores");

            return coleccion.insertOne(objColor);
        })
        .then( ({insertedId}) => ok(insertedId))
        .catch( error => ko({ error : "error en la bbdd" }))
        .finally(() => {
            if(conexion){
                conexion.close();
            }
        });
   }); 
}

export function borrarColor(id){ 
   return new Promise((ok,ko) => {
        let conexion = null;

        conectar()
        .then( conexionMongodb => {
            conexion = conexionMongodb;
            
            let coleccion = conexion.db("colores").collection("colores");

            return coleccion.deleteOne({ _id : new ObjectId(id) });
        })
        .then( ({deletedCount}) => ok(deletedCount))
        .catch( error => ko({ error : "error en la bbdd" }))
        .finally(() => {
            if(conexion){
                conexion.close();
            }
        });
   }); 
}

export function actualizarColor(id,objCambios){ 
   return new Promise((ok,ko) => {
        let conexion = null;

        conectar()
        .then( conexionMongodb => {
            conexion = conexionMongodb;
            
            let coleccion = conexion.db("colores").collection("colores");

            return coleccion.updateOne({ _id : new ObjectId(id) }, { $set : objCambios });
        })
        .then( ({modifiedCount,matchedCount}) => ok({modifiedCount,matchedCount}))
        .catch( error => ko({ error : "error en la bbdd" }))
        .finally(() => {
            if(conexion){
                conexion.close();
            }
        });
   }); 
}




