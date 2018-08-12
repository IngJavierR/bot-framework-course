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
        var heroCard = new builder.HeroCard(session)
            .title('Tarjeta Hero Card')
            .subtitle('Colocas un subtitle')
            .text('Sigue a Javier Rodriguez')
            .images([
                builder.CardImage.create(session, 'https://files.merca20.com/uploads/2016/06/Dona-Krispy-Kreme.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.merca20.com/krispy-kreme-merca2-0-te-regalan-una-docena-donas/')
            ]);
        var heroCard2 = new builder.HeroCard(session)
            .title('Tarjeta Hero Card2')
            .subtitle('Colocas un subtitle2')
            .text('Sigue a Javier Rodriguez')
            .images([
                builder.CardImage.create(session, 'https://files.merca20.com/uploads/2016/06/Dona-Krispy-Kreme.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://www.merca20.com/krispy-kreme-merca2-0-te-regalan-una-docena-donas/')
            ]);

            var tarjetas = [heroCard, heroCard2];

            //var msj = new builder.Message(session).addAttachment(heroCard);
            var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
            session.send(msj);
        
            

    }
])