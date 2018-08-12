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
        builder.Prompts.text(session, 'Como te llamas?');
    },
    function(session, results) {
        let name = results.response;
        session.send(`Hola ${name}`);

        session.beginDialog('/preguntarLugar');
    },
    function(session, results) {
        let place = results.response;
        session.send(`Saludos hasta ${place}`);
    }
]);

bot.dialog('/preguntarLugar', [
    function(session) {
        builder.Prompts.text(session, 'Donde estas?');
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
])