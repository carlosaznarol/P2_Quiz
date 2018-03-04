const model = require('./model');
const {log,biglog,errorlog,colorize} = require("./out");

/**
 * Muestra la ayuda
 */

exports.helpCmd = rl =>{
    log("Comandos: ");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show<id> - Muestra la pregunta y la respuest el quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete<id> - Borrar el quiz inidcado.");
    log("  edit<id> - Editar el quiz indicado.");
    log("  test<id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Creditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};

/**
 * Lista todos los comandos existentes en el modelos.
 */

exports.listCmd = rl =>{
    model.getAll().forEach((quiz,id) => {
        log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};

/**
 * Muestra el quiz indicado en el parámetro: la pregunta y la respuesta
 *
 * @param id Clave del quiz a mostrar
 */

exports.showCmd = (rl ,id) =>{
    if(typeof  id === "undefined"){
        errorlog(`Falta el parámetro id.`);
    }else{
        try {const quiz = model.getByIndex(id);
            log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        }catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();

};

/**
 * Añadir un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y por la respuesta.
 */
exports.addCmd = rl  =>{
    rl.question(colorize(' Introduzca una pregunta: ', 'red'),question => {
        rl.question(colorize(' Introduzca una respuesta ','red'), answer => {
            model.add(question,answer);
            log(` ${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        });
    });
};

/**
 * Borra un quiz del modelo.
 *  @param id Clave del quiz a borrar
 */

exports.deleteCmd = (rl ,id) =>{
    if(typeof  id === "undefined"){
        errorlog(`Falta el parámetro id.`);
    }else{
        try {
            model.deleteByIndex(id);
        }catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();

};

/**
 * Edita el quiz indicado.
 * @param id Clave del quiz a editar
 */
exports.editCmd = (rl ,id) =>{
    if(typeof  id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() =>{ rl.write(quiz.question)},0);

            rl.question(colorize(' Introduzca una pregunta: ', 'red'),question => {

                process.stdout.isTTY && setTimeout(() =>{ rl.write(quiz.answer)},0);

                rl.question(colorize(' Introduzca una respuesta ','red'), answer => {
                    model.update(id,question,answer);
                    log(` Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        }catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }

};

/**
 * Prueba el quiz indicado.
 * @param id Clave del quiz a probar
 */
exports.testCmd = (rl, id) =>{
    if(typeof  id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    }else{
        try{
            const quiz = model.getByIndex(id);
            rl.question(colorize ('¿' +quiz.question+'?' , 'red'), respuesta => {

               if( respuesta.toLowerCase().trim() === quiz.answer.toLowerCase()){
                   log(`Su respuesta es correcta.`);
                   biglog('Correcta','green' );
                   rl.prompt;
               }else {
                   log(`Su respuesta es incorrecta.`);
                   biglog ('Incorrecta','red');
                   rl.prompt;
               }

            });

        }catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};


/**
 * Jugamos.
 */
exports.playCmd = rl  =>{
    log("Jugar.",'red');
    rl.prompt();

};

/**
 * Creditos.
 */
exports.creditCmd = rl  =>{
    log("Autor de la practica");
    log("Carlos",'green');
    rl.prompt();

};

/**
 * Salimos del programa.
 */
exports.quitCmd = rl  =>{
    rl.close();
    rl.prompt();

};

