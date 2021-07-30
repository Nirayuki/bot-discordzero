const Discord = require("discord.js");
const ytdl = require("ytdl-core-discord");
const cron = require('cron');
require('dotenv/config');

const client = new Discord.Client();
let counter = {};
let queue = [];

async function playQueue(connection) {
    connection.play(await ytdl(queue[0]), { type: 'opus' }).on("finish", () => {
        console.log(queue)
        queue = queue.filter(song => song != queue[0])
        if (queue.length > 0) {
            playQueue(connection);
        }
    });
}

const filter = (reaction, user) => {
    return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
};

client.once('ready', () => {
    client.user.setActivity('Aprendendo');
    // 
    
    console.log(client.members);
    console.log('Iniciado com sucesso!');
});

const Data = new Date;
const Horas = Data.getHours();
const Minutos = Data.getMinutes();



const scheduledMessage = (props) => {
    let message = new cron.CronJob('* 2 */2 * * *', () => {
        client.channels.cache.get("783883817089892393").send(`Está na hora do bump <@&${props.role.id}>`);
        console.log("tá caindo a cada 10s");
    })

    if(props.start === true) {
        message.start()
        client.channels.cache.get("780665727547736075").send("Schedule iniciado com sucesso!");
    } else {
        message.stop()
        client.channels.cache.get("780665727547736075").send("Schedule parado com sucesso!");
    }
}

client.on('message', message => {
    try {
        const activeRole = message.guild.roles.cache.find(role => role.name = "Active");
        if (message.author.bot) return;

        if (activeRole) {
            if (!counter[message.author.id]) {
                counter[message.author.id] = 1;
            } else {
                counter[message.author.id] += 1;
            }

            if (counter[message.author.id] >= 100 && !message.member.roles.cache.has(activeRole.id)) {
                message.member.roles.add(activeRole).then((member) => {
                    message.reply("Parabéns, pela sua participação você ganhou um novo cargo!");
                }).catch(console.error);
            }
        }

        const prefix = process.env.PREFIX;
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const arguments = message.content.slice(prefix.length).trim().split(' ');
        const command = arguments.shift().toLowerCase();

        if (command === "ping") {
            message.reply("Pong!");
        }

        if (command === "anderson") {
            message.reply("Maravilhoso apenas...!");
        }

        if (command === "time") {
            message.reply(Minutos);
            console.log(Minutos);
        }

        if (command === "teste") {
            const teste = message.guild.roles.cache.find((role) => role.name === "Moderators");
            message.reply(teste)
        }

        if(command === "schedule") {
            // scheduledMessage(message.guild.roles.cache.find((role) => role.name === "Moderators"));
            const data = {
                start: true,
                role: message.guild.roles.cache.find((role) => role.name === "Bumper")
            }
            scheduledMessage(data);
        }

        if(command === "schedulestop") {
            // scheduledMessage(message.guild.roles.cache.find((role) => role.name === "Moderators"));
            const data = {
                start: false,
                role: message.guild.roles.cache.find((role) => role.name === "Bumper")
            }
            scheduledMessage(data);
        }

        if (command === "play") {
            const voice = message.member.voice;
            const URL = arguments[0];

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando.");
                return;
            }

            if (!URL) {
                message.reply("É preciso enviar a URL do vídeo para ser reproduzido");
                return;
            }

            if (!queue[0]) {
                queue.push(URL);
                console.log(queue);
                voice.channel.join().then((connection) => {
                    try {
                        playQueue(connection);
                    } catch (ex) {
                        message.reply("Erro ao reproduzir mídia");
                        console.error(ex);
                    }
                });
            } else {
                queue.push(URL);
                console.log(queue);
            }
        }

        if (command === "leave") {
            const voice = message.member.voice;

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando.");
                return;
            }

            voice.channel.leave();
        }

        if (command === "resetqueue") {
            console.log("Resetando queue");
            const voice = message.member.voice;

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando.");
                return;
            }

            queue.forEach(() => {
                queue.pop();
            })

            message.reply("Queue resetada.");
            voice.channel.leave();
        }

        // ************************************************************************************* //

        if (command === "evaseries") {

            const venusRole = message.guild.roles.cache.find((role) => role.name === "N.E. #2 - Venus");

            const nervEmoji = message.guild.emojis.cache.find(emoji => emoji.name === "nerv");

            message.channel.send(`Iniciando ... PROTOCOLO V.E.N.U.S.\nIniciado! Reaja a essa mensagem para garantir seu acesso ao evento.`).then((message) => {
                message.react(nervEmoji);

                message.client.on('messageReactionAdd', (reaction, user) => {
                    const member = message.guild.members.cache.find((member) => member.id === user.id);
                    if (!user.bot && reaction.emoji.name === nervEmoji.name) {
                        member.roles.add(venusRole);
                    }
                })

                message.client.on('messageReactionRemove', (reaction, user) => {
                    const member = message.guild.members.cache.find((member) => member.id === user.id);
                    if (!user.bot && reaction.emoji.name === nervEmoji.name) {
                        member.roles.remove(venusRole);
                    }
                })
        });

            user.roles.add(venusRole);
            message.reply(`Bem vindo ao evento Venus, ${userToAdd.username}`);
        }

        // ************************************************************************************* //

        if (command == "help") {

            message.reply({
                embed: {
                    color: 3066993,
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    title: "EVA Unit-00 ONLINE",
                    description: "Olá, sou a EVA Unit-00 sou a unidade de desenvolvimento oficial da NERV Open Source.",
                    fields: [{
                        name: '!play <url youtube>',
                        value: "Reprodiz o audio do vídeo requisitado no canal de voz"
                    },
                    {
                        name: '!leave',
                        value: "Para o reprodução e saí do canal de voz"
                    },
                    {
                        name: "!resetqueue",
                        value: "Limpa a queue de reprodução"
                    },
                    {
                        name: "!roles",
                        value: "Verifica e pega cargos no servidor"
                    }
                    ]
                }
            })
        }
    } catch (ex) {
        message.reply("Ocorreu um erro interno, por favor relate isso aos moderadores.");
    }
})

client.login(process.env.API_TOKEN);