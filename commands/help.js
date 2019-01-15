const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async(bot, message, args, con) => {
    fs.readdir("./commands/", (err, files) => {
        if(err) console.error(err);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

    var namelist = "";
    var desclist = "";
    var usage = "";

    const commandshelp = new Discord.RichEmbed()
    .setThumbnail('https://i.imgur.com/pzs08BP.jpg')
    .setColor(0x1436B8)

let result = jsfiles.forEach((f, i) => {
    let props = require(`./${f}`);
    namelist = props.help.name;
    desclist = props.help.description;
    usage = props.help.usage;

    commandshelp
    .addField(`${usage}`, `${desclist}`)

    
    
});

message.author.send(commandshelp);

});

message.reply("Revisa los mensajes privados para mas informacion");

}//end of module


module.exports.help = {
    name: "help",
    description: "Muestra todos los comandos disponibles en un mensaje privado",
    usage: "+help"
  }