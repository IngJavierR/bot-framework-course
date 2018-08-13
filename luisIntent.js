var restify = require('restify');
var builder = require('botbuilder');
var dotEnv = require('dotenv');

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
dotEnv.config();
let luisApp = process.env.LUIS_APP;
let luisKey = process.env.LUIS_KEY;
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${luisApp}?subscription-key=${luisKey}&verbose=true&timezoneOffset=-360&q=`

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({recognizers: [recognizer]});
bot.dialog('/', dialog);

dialog.matches('ComprarBoletos', [
    (session, args, next) => {
        var cine = builder.EntityRecognizer.findEntity(args.entities, 'Cine');
        if(!cine){
            builder.Prompts.text(session, 'Para que Cine los quieres?');
        }
        else{
            next();
        }
    },
    (session, args) => {
        builder.Prompts.text(session, 'Cuantos boletos quieres?');
    },
    (session, args) => {
        session.send(`Quieres comprar ${args.response}`);
    }
]);

dialog.matches('ConsultarPeliculas', [
    function(session, args, next) {
        session.send('Ok te muestro algunas peliculas');
    }
]);

dialog.onDefault(builder.DialogAction.send('No entendi'));