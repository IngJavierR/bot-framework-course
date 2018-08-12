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
    function(session, results, next) {
        if(!session.userData.name) {
            builder.Prompts.text(session, 'Como te llamas?');
        }
        else{
            next();
        }
    },
    function(session, results) {
        if(results.response){
            let name = results.response;
            session.userData.name = name;
        }
        session.send(`Hola ${session.userData.name}`);
    }
])