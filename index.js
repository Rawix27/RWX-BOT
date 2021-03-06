console.log('Beep boop beep, estoy listo');
const Discord = require('discord.js');
const { Client, RichEmbed } = require('discord.js');
const bot = new Discord.Client();
const botconfig = require("./botconfig.json");
const fs = require("fs");
const mysql = require("mysql");
bot.commands = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("No se han encontrado comandos");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});



var con = mysql.createConnection({
  host: botconfig.host,
  user: botconfig.user,
  password: botconfig.password,
  database: botconfig.database,
  port: botconfig.port
})

con.connect(err => {
  if(err) throw err;
  console.log("Conectado a la base de datos");
  con.query("SHOW TABLES");
})



bot.on("ready", async () => {
  console.log(`${bot.user.username} esta funcionando en ${bot.guilds.size} servers!`); //Muestra en consola la cantidad de servidores en donde el bot esta funcionando
  bot.user.setActivity("RWXBOT | +help", {type: "PLAYING"}); //Establece el estado del bot a JUGANDO o MIRANDO

});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };

    
}

let prefix = prefixes[message.guild.id].prefixes;


  //let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args, con);

 
    

});

setInterval(function () {
  con.query('SELECT 1');
  //console.log(con.query('SELECT 1'));
}, 3600000);

  bot.login(botconfig.token);