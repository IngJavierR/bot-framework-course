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

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, ['Como te llamas?', 'Y tu nombre es?']);
    },
    function(session, results) {
        session.dialogData.name = results.response;
        builder.Prompts.number(session, `Ok ${session.dialogData.name}, Cual es tu edad?`);
    },
    function(session, results) {
        session.dialogData.age = results.response;
        builder.Prompts.time(session, 'Que hora es?');
    },
    function(session, results) {
        session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.choice(session, 'Cual prefieres?', 'Mar|Montaña', { listStyle: builder.ListStyle.button });
    },
    function(session, results) {
        session.dialogData.preference = results.response.entity;
        builder.Prompts.confirm(session, 'Quieres ver un resumen?', { listStyle: builder.ListStyle.button });
    },
    function(session, results) {
        if(results.response) {
            session.send(`${session.dialogData.name} 
                        tienes ${session.dialogData.age} 
                        son las: ${session.dialogData.time} 
                        prefieres: ${session.dialogData.preference}`);
        }else {
            session.send('Terminaste');
        }
        session.endDialog();
    }
]);