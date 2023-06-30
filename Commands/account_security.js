const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { JsonDatabase } = require("five.db");

const db = new JsonDatabase({ databasePath: `./Database/Database`});

module.exports.execute = async(client, interaction) => {

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({content: "To use this command, you need to have manage channels authority.", ephemeral: true})
    
    if (interaction.options.getSubcommand() === `set`) {

    const kanal1 = interaction.options.getChannel('channel')
   db.set(`acsecr1_${interaction.guild.id}`, kanal1.id)
   const embed = new EmbedBuilder()
   .setDescription("> Picture Welcome Bye Bye Channel Set Up Successfully!")
   .setColor("#2b2d31")
   interaction.reply({embeds: [embed]})
    }
    if (interaction.options.getSubcommand() === `reset`) {
        db.delete(`acsecr1_${interaction.guild.id}`)
        const embed = new EmbedBuilder()
        .setDescription("> Picture Welcome Bye Bye Channel Reset Up Successfully!")
        .setColor("#2b2d31")
        interaction.reply({embeds: [embed]})
    }

}
module.exports.config = {
    name:"as",
    description: 'Set to as system.',
    type:1,
    options: [
        {
            name:"set",
            description:"setting operations",
            type:1,
            options:[{name:"channel",description:"Set to as channel.",type:7,required:true,channel_types:[0]}]            
        },
        {
            name:"reset",
            description:"setting operations",
            type:1,
        },
       
    ],
}
