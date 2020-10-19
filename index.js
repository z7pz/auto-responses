require('better-logging')(console);
const { Client, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { errorMonitor } = require('ws');
const autoresSchema = require('./schemas/autores')
const client = new Client();
const prefix = '!'
const MONGODB_URI = 'mongodb://localhost:27017/myapp';
const TOKEN = 'TOKEN HERE';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

client
	.on('ready', () => {
		console.log(`${client.user.tag} Logged it`);
	})
	.on('message',async (message) => {
        if(message.author.bot) return;
        var data = await autoresSchema.find({guildId: message.guild.id})
        if(data) {
            const f = data.find(c => c.msg === message.content) 
            if(f) {
            return message.channel.send(f.res)
            }
        }
		if(message.content.startsWith(prefix + 'smash-add')) {
            message.channel.send('**Hi, Please send msg thats you want \\😁, `SMASH`**')
            message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(c => {
                message.channel.send('**Now please send the response, `SMASH`**')
                message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(async(d) => {
                    const id = idgen()
                    message.channel.send(new MessageEmbed()
                    .setTitle('\\🌌 Auto responsess')
                    .setColor('AQUA')
                    .setDescription(`**\`\`\`>  msg: ${c.first().content}\n>  res: ${d.first().content}\n>  Id: ${id} \`\`\`**`));
                    await autoresSchema.create({ guildId: message.guild.id, msg: c.first().content, res: d.first().content, makeId: idgen() });
                })
            })
        }
        if(message.content.startsWith(prefix + 'smash-list')) {
            if(data) {
                console.log(data)
                message.channel.send(new MessageEmbed()
                .setTitle('\\🌌 Auto responsess')
                .setColor('AQUA')
                .setDescription(data.map((d, index) => `**#${index+ 1}\n> \`\`\` Message: ${d.msg}\n>  Response: ${d.res} \n>  Id: ${d.makeId}\`\`\`**`))
                )
            }
        }
        if(message.content.startsWith(prefix + 'smash-edit')) {
            
            message.channel.send('Please send document ID (Auto response id)')
            message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(async(c) => {
                var datas = await autoresSchema.findOne({guildId: message.guild.id, makeId: c.first().content})
                if(!datas) return message.channel.send('I can\'t find anything')
                message.channel.send('Please send new msg')
                message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then((d) => {
                    message.channel.send('Please send new Response')
                    message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {max: 1}).then(async(e) => {
                        datas.msg = d.first().content
                        datas.res = e.first().content
                        await datas.save()
                        message.channel.send('Done thats save')
                    })
                })
            })
        }
	});

client.login(TOKEN);


function idgen() {
    return  `_${Math.random().toString(36).substr(2, 5)}_${Math.random().toString(36).substr(2, 5)}`
}
