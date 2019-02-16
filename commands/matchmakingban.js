const Discord = require("discord.js");
const ms = require("ms");
const embed = new Discord.RichEmbed()
const moment = require('moment')

const botconfig = require("../botconfig.json");
const mysql = require("mysql");

var con = mysql.createConnection({
  host: botconfig.host,
  user: botconfig.user,
  password: botconfig.password,
  database: botconfig.database,
  port: botconfig.port
})

module.exports.run = async (bot, message, args) => {

  let miembroStaff = message.member.roles.find("name", "Staff");
  
  let miembroArbitro = message.member.roles.find("name", "Arbitro");

  if (miembroStaff || miembroArbitro) {

    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!tomute) return message.reply("No se ha mencionado al usuario.");
    //if(!bot.hasPermission("MANAGE_MESSAGES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR MENSAJES");
    //if(!bot.hasPermission("MANAGE_ROLES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR ROLES");
    // if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");  
    let muterole = message.guild.roles.find(`name`, "Matchmaking");
    
    //IF role is not finded
    if (!muterole) {
      try {
        return message.reply("No se ha encontrado el rol especificado.");
        /* muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        }); */
      } catch (e) {
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if (!mutetime) return message.reply("Tiempo no especificado");


    /* const segundos = 's';
     const minutos = 'm';
     const horas = 'h';
     const dias = 'd';
     const meses = 'M';
     const años = 'y'; */

    let date = moment().format('lll');
    let dateBan = moment(date).format('lll');
    const TIEMPO = parseInt(mutetime, 10);
    var UNIDAD = mutetime[mutetime.length - 1];
    //console.log(UNIDAD);
    let dateUnban = moment(date).add(TIEMPO, UNIDAD).format('lll'); // ACA SI FUNCIONA

    let reason = args.slice(2).join(" ");

    await (tomute.removeRole(muterole.id));

    exports.tomute = tomute;

    con.query(`SELECT bans FROM bans WHERE id = '${tomute.id}'`, (err, rows) => {
      if (err) throw err;
      let sql;
      if (rows.length < 1) {
        con.query(`INSERT INTO bans (id,bans,lastban) VALUES ('${tomute.id}', '1', '${dateBan}')`)
        sql = `SELECT bans FROM bans WHERE id = '${tomute.id}'`
        con.query(sql, (err, rows) => {
          if (err) throw err;
          let bans = rows[0].bans;
          const embedBan1 = new Discord.RichEmbed()
            .setTitle('USUARIO BANEADO')
            .setColor(0xBC2B2B)
            .setDescription(`*El usuario <@${tomute.id}> ha sido baneado por ${ms(ms(mutetime))}*`)
            .addField(`Usuario:`, `<@${tomute.id}>`)
            .addField(`Desde:`, `${dateBan}`)
            .addField(`Hasta:`, `${dateUnban}`)
            .addField(`Razon/Motivo:`, `${reason}`)
            .addField(`Baneado por:`, `${bans}° vez`)
            .setFooter('Baneado por: ' + message.author.tag, message.author.displayAvatarURL)
            .setThumbnail('https://i.imgur.com/C7BGflk.png')

          message.channel.send(embedBan1);
        })

      } else {
        let bans = rows[0].bans;
        sql = `UPDATE bans SET bans = ${bans + 1}, lastban = '${dateBan}' WHERE id = '${tomute.id}'`;
        const embedBan1 = new Discord.RichEmbed()
          .setTitle('USUARIO BANEADO')
          .setColor(0xBC2B2B)
          .setDescription(`*El usuario <@${tomute.id}> ha sido baneado por ${ms(ms(mutetime))}*`)
          .addField(`Usuario:`, `<@${tomute.id}>`)
          .addField(`Desde:`, `${dateBan}`)
          .addField(`Hasta:`, `${dateUnban}`)
          .addField(`Razon/Motivo:`, `${reason}`)
          .addField(`Baneado por:`, `${bans + 1}° vez`)
          .setFooter('Baneado por: ' + message.author.tag, message.author.displayAvatarURL)
          .setThumbnail('https://i.imgur.com/C7BGflk.png')

        message.channel.send(embedBan1);
      }
      con.query(sql);
    });

    setTimeout(function () {
      tomute.addRole(muterole.id);

      const embedUnban1 = new Discord.RichEmbed()
        .setTitle('USUARIO DESBANEADO')
        .setColor(0x4EBA2A)
        .setDescription(`*El usuario <@${tomute.id}> ha sido desbaneado y esta habilitado para jugar*`)
        .addField(`Usuario:`, `<@${tomute.id}>`)
        .addField(`Fecha:`, `${date}`)
        .addField(`Razon/Motivo:`, `${reason}`)
        .setFooter('Baneado por: ' + message.author.tag, message.author.displayAvatarURL)
        .setThumbnail('https://i.imgur.com/vayT334.png')
      // Send the embed to the same channel as the message
      // message.channel.find("name", "matchmaking-bans");
      message.channel.send(embedUnban1);

    }, ms(mutetime));

    //end of principal IF to check role
  }

  if (!miembroStaff && !miembroArbitro) return message.reply("No tenes los permisos suficientes")
  
  //end of module
}

module.exports.help = {
  name: "mmban",
  description: "Banea a un usuario del canal matchmaking",
  usage: "+mmban [@user] [tiempo] [razon]"
}
