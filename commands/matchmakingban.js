const Discord = require("discord.js");
const ms = require("ms");
const embed = new Discord.RichEmbed()
const moment = require('moment')

const botconfig = require("../botconfig.json");
const mysql = require("mysql");

const date = moment().format('lll');
let numerodebaneos = 0;
let dateBan = moment(date).format('lll');
exports.numerodebaneos = numerodebaneos;
exports.dateBan = dateBan;





// const dateUnban = moment(date).add(mutetime).format('lll'); // ACA NO FUNCIONA, TIENE QUE IR DEBAJO de MUTETIME

var con = mysql.createConnection({
  host: botconfig.host,
  user: botconfig.user,
  password: botconfig.password,
  database: botconfig.database
})

module.exports.run = async (bot, message, args) => {

  let miembroStaff = message.member.roles.find("name", "Staff");


  if (miembroStaff) {

    //+mmban @user 1s/m/h/d
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!tomute) return message.reply("No se ha mencionado al usuario.");
    //if(!bot.hasPermission("MANAGE_MESSAGES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR MENSAJES");
    //if(!bot.hasPermission("MANAGE_ROLES")) return message.reply("El BOT necesita los siguientes permisos: ADMINISTRAR ROLES");
    // if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");  
    let muterole = message.guild.roles.find(`name`, "Matchmaking");
    //start of create role
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
     const meses = 'mo';
     const años = 'y'; */

    //const TIMEOUTT = setTimeout;
    //message.reply(`tiempo`);


    const TIEMPO = parseInt(mutetime, 10);
    // const LongitudStringTiempo = TIEMPO.length;
    var UNIDAD = mutetime[mutetime.length - 1];
    console.log(UNIDAD);
    //message.reply(`${TIEMPO}`);
    //message.reply(`${UNIDAD}`);
    var dateUnban = moment(date).add(TIEMPO, UNIDAD).format('lll'); // ACA SI FUNCIONA


    //let reason = args[2];
    let reason = args.slice(2).join(" ");

    await (tomute.removeRole(muterole.id));
    // message.reply(`<@${tomute.id}> ha sido baneado por ${ms(ms(mutetime))}`);


    exports.tomute = tomute;
    exports.tomuteestadoBan = tomute.estadoBan;
    //tomute.numerodebaneos++;

    // let rows;
    // let bans;

    // con.query(`SELECT bans FROM bans WHERE id = '${tomute.id}'`, (err, rows) => {
    //   if (err) throw err;
    //   let sql;
    //   let sql2;
    //   //let bans = rows[0].bans;      //TRY ADDING THIS LINE RIGHT HERE
    //   if (rows.length < 1) {
    //     sql2 = `INSERT INTO bans (id,lastban) VALUES ('${tomute.id}', '${dateBan}')`
    //   } else {
    //     sql2 = `UPDATE bans SET lastban = '${dateBan}' WHERE id = '${tomute.id}'`;
    //   }

    //   //let bans = rows[0].bans;
    //   con.query(sql2);
    // });


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






    /*
 
    const embedBan1 = new Discord.RichEmbed()
    .setTitle('USUARIO BANEADO')
    .setColor(0xBC2B2B)
    .setDescription(`*El usuario <@${tomute.id}> ha sido baneado por ${ms(ms(mutetime))}*`)
    .addField(`Usuario:`, `<@${tomute.id}>`)
    .addField(`Desde:`, `${dateBan}`)
    .addField(`Hasta:`, `${dateUnban}`)
    .addField(`Razon/Motivo:`, `${reason}`)
    .addField(`Baneado por:`, `${bans + 1}° vez`)
    .setFooter('Baneado por: '+message.author.tag, message.author.displayAvatarURL)
    .setThumbnail('https://i.imgur.com/C7BGflk.png')
    // Send the embed to the same channel as the message
    // message.channel.send(embedBan1);
    // message.channel.find("name", "matchmaking-bans");
    message.channel.send(embedBan1);

    */


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

  if (!miembroStaff) return message.reply("No tenes los permisos suficientes")


  //end of module
}

module.exports.help = {
  name: "mmban",
  description: "Ban an user from the matchmaking channel",
  usage: "+mmban @user 'tiempo' 'razon'"
}