const  fs = require("fs");

//Nombre del fichero donde se guardan las preguntas.
//Es un fichero de texto con el JSON de quizzes.
const DB_FILENAME = "quizzes.json";

//Modelo de datos
//
//En esta variable se mantine todos los quizzes existente
//Es un array de objetos, donde cada objeto tiene los atributos question
//y answer para guardar el texto de la pregunta y el de la respuesta.
let quizzes =[
    {
        question:"Capital de Italia",
        answer:"Roma"
    },
    {
        question:"Capital de Francia",
        answer:"París"
    },
    {
        question:"Capital de España",
        answer:"Madrid"
    },
    {
        question:"Capital de Portugal",
        answer:"Lisboa"
    }];
/**
 * Este metodo carga el contenido del fichero DB_FILENAME en la variable
 * quizzes. El contenido de ese fichero está en formato JSON.
 */

const load = () => {
    fs.readFile(DB_FILENAME,(err, data) => {
        if (err){
            //La primera vez no existe el fichero
            if(err.code === "ENOENT"){
                save(); //valores iniciales
                return;
            }
            throw err;
        }
        let json = JSON.parse(data);
        if(json){
            quizzes = json;
        }
    });
};

/**
 * Guarda las preguntas en el fichero
 */
const  save = () =>{
    fs.writeFile(DB_FILENAME,
        JSON.stringify(quizzes),
        (err) =>{
            if(err) throw err;
        });
};

//
/*
 *Devuelve el numero total de preguntas existentes
 *
 * @retuns{number} número total de preguntas existentes
 */
exports.count = () => quizzes.length;

/**
 * Añade un nuevo quiz
 *
 * @param question   String con la pregunta
 * @param answer     String con la respuesta
 */
exports.add = (question, answer) =>{
    quizzes.push({
        question: (question || "").trim(),
        answer: (answer || "").trim()
    });
    save();
};

/**
 *Actualiza el quiz en la posicion index
 *
 * @param id         clave que identifica el quiz a actualizar
 * @param question   String con la pregunta
 * @param answer     String con la respuesta
 */
exports.update = (id,question, answer) =>{
    const quiz = quizzes[id];
    if(typeof  quiz === "undefined"){
        throw new Error(`El valor del parámetro id no es válido`);
    }
    quizzes.splice(id, 1, {
        question:(question || "").trim(),
        answer:(answer || "").trim()
    });
    save();
};

/**
 * Deuelve todos los quizzes existentes
 *
 * Devuelve un clon del valor guardado en la variable quizzes, es decir, devuelve un
 * objeto nuevo con todas las preguntas existentes.
 * Para clonar quizzes se usa stringify + parse.
 *
 * @retuns {any}
 */
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

/**
 * Devuelve un clon del quiz almacenado en la posicion dada.
 * Para clonar quizzes se usa stringify + parse.
 * @param id Clave que identifica el quiz a devolver
 * @returns {question,answer} Devuelve el objeto quiz de la posicion dada
 */
exports.getByIndex = id => {
    const quiz = quizzes[id];
    if(typeof quiz === "undefined"){
        throw new Error(`El valor del parámetro id no es válido.`);
    }
    return JSON.parse(JSON.stringify(quiz));
};
//
/**
 * Elimina el quiz situado en la posicion dada
 * @param id Clave que identifica el quiz a borrar.
 */
exports.deleteByIndex = id => {
    const quiz = quizzes[id];
    if (typeof quiz === "undefined"){
        throw new Error(`El valor del parámetro no es válido.`);
    }
    quizzes.splice(id,1);
    save();
};

//Carga los quizzes almacenados en el fichero
load();