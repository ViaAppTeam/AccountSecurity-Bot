require('advanced-logs');
require("dotenv");

const { PermissionsBitField, EmbedBuilder, interaction } = require("discord.js")

const { JsonDatabase } = require("five.db");

const db = new JsonDatabase({ databasePath: `./Database/Database`});

console.setConfig({
    background: true,
    timestamp: false
}); 

const fs = require("fs");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
    ],
    allowedMentions: {
        parse: [
            "everyone",
            "roles",
            "users"
        ]
    },
});

client.slashCommands = new Collection();
client.registerdCommands = new Collection();

const config = require("./config");

const loadingCommands = () => {

    for(const command of fs.readdirSync("./Commands/").filter(file => file.endsWith(".js"))) {
        const cmd = require(`./Commands/${command}`);
    
        client.slashCommands.set(cmd.config.name, cmd)
        client.registerdCommands.set(cmd.config.name, cmd.config)
        console.success(`${cmd.config.name} komutu başarıyla aktif edildi.`)
    }
}

const loadingEvents = () => {
    for(const event of fs.readdirSync("./Functions").filter(file => file.endsWith(".js"))) {
        const evt = require(`./Functions/${event}`);

        if(evt.config.once) {
            client.once(evt.config.name, (...args) => {
                evt.execute(client, ...args)
            }); 
        } else {
            client.on(evt.config.name, (...args) => {
                evt.execute(client, ...args)
            }); 
        }
    }
}

const slashCommandsRegister = () => {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v10");

    client.once("ready", async() => {
        const rest = new REST({ version: "10" }).setToken(config.client.token);
      try {
        await rest.put(Routes.applicationCommands(config.client.id), {
          body: client.registerdCommands,
        }).then(() => {
            console.info(`Registered Command Count ${client.registerdCommands.size}`)
        });
      } catch (error) {
        throw error;
      }
    })};


loadingCommands();
loadingEvents();
slashCommandsRegister();

client.login(config.client.token).then(() => {
    console.success(`Welcomer Successfully connected.`);
}).catch((err) => {
    console.error(`Welcomer No connection. Err: ${err}`);
});

client.on("ready", () => {
  client.user.setActivity(`Hello! I'm ViaApp, I'm here to serve you.`);
});

client.on('guildMemberAdd', async member => {
  const acsecr = db.fetch(`acsecr1_${member.guild.id}`)
  if (!acsecr) return;
  const security = await new canvafy.Security()
    .setAvatar(member.user.displayAvatarURL({extension:"png",forceStatic:true}))
    .setBackground("image", "https://cdn.discordapp.com/attachments/1087030211813593190/1110243947311288530/beeautiful-sunset-illustration-1212023.webp")
    .setCreatedTimestamp(member.user.createdTimestamp)
    .setSuspectTimestamp(604800000) // 1 week millisecond
    .setBorder("#f0f0f0")
    .setLocale("en") // country short code - default "en"
    .setAvatarBorder("#f0f0f0")
    .setOverlayOpacity(0.9)
    .build();

  member.guild.channels.cache.get(acsecr).send({
    content: `Welcome ${member}!`,
    files: [{
      attachment: security,
      name: `security-${member.id}.png`
    }]
  });
});

