var restify = require('restify');
var builder = require('botbuilder');

//Levanta Restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`${server.name} listen to ${server.url}`);
});

var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

bot.use({
    botbuilder: (session, next) => {
        logMensajeEntrante(session, next);
    },
    send: (event, next) => {
        logMensajeSaliente(event, next);
    }
});

bot.dialog('/', [
    (session, results, next) => {
        builder.Prompts.text(session, 'Como te llamas?');
    },
    (session, results) => {
        session.dialogData.nombre = results.response;
        session.send(`Hola ${session.dialogData.nombre}`);
    }
])
.cancelAction('Cancelar', 'Ok cancelamos', { matches: /^cancelar$/i })
.beginDialogAction('Interrumpir accion', '/interrumpir', { matches: /^interrumpir$/i });

bot.dialog('/interrumpir', [
    (session, results, next) => {
        builder.Prompts.confirm(session, 'Quiere regresar?');
    },
    (session, results) => {
        if(results.response) {
            session.endDialog('A mi tambien');
        }else {
            session.endDialog('A mi tampoco');
        }
    }
]);

/*bot.dialog('/cancelar', [
    (session) => {
        session.endDialog('No hay problema cancelamos');
    }
]).triggerAction({ matches: /^cancelar$/i });*/

function logMensajeEntrante(session, next) {
    console.log(session.message.text);
    next();
}
function logMensajeSaliente(event, next) {
    console.log(event.text);
    next();
}