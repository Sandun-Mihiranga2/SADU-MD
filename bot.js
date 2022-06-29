const Config = require('./config');
const config = require('./config');
const events = require("./events");
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, getContentType } = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')
const simpleGit = require('simple-git');
const git = simpleGit();
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })
const { state, saveState } = useSingleFileAuthState('./session.json')

//======================== ADD RECENTLY =================================
const path = require("path");
const chalk = require('chalk');
const Language = require('./language');
const Lang = Language.getString('updater');
const got = require('got');
const axios = require('axios');
const {Message, StringSession, Image, Video} = require('./DIANA/');
const { DataTypes } = require('sequelize');
const { getMessage } = require("./plugins/sql/greetings");
//=====================================================================


//==========================PLUGINS==============================
const { song ,  asong ,  dsong , getyt , video , yt720p , yt480p , yt360p}  = require('./plugins/youtube');
const { kick , add } = require('./plugins/admin')
const sticker = require('./plugins/sticker')
const alive = require('./plugins/alive')
const react = require('./plugins/react')
const setvar = require('./plugins/heroku')
const { updiana , fixdiana } = require('./plugins/aupdater')
const emoji = require('./plugins/emojitest.js')
const plugindb = require('./plugins/sql/plugin');

//=================================END===========================

const prefix = '.'
const ownerNumber = ['94773834316']


//=========================================sql==================
const LUSIFARDB = config.DATABASE.define('LUSIFAR', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});


//==========================sql end=======================================





















console.log('bot'); 
console.log('Version: 00...'  );
console.log('ℹ️ Connecting to WhatsApp... Please wait.');






const connectToWA = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})
	
	conn.ev.on('connection.update', async(update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
				connectToWA()
			}
		} else if (connection === 'open') {
			console.log('conected')
      //==============================install plugins=======================================

/*/============================================install exteranal plugins====================================
			console.log( chalk.blueBright.italic('⬇️ Installing external plugins...') );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });
//======================================= end install exteranal plugins====================================	*/		
//============================================install data base plugins====================================			
	console.log(chalk.blueBright.italic('⬇️  Installing plugins...') );
        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });
//======================================= end install data base plugins====================================			
        console.log(chalk.green.bold('bot 𝚠𝚘𝚛𝚔𝚒𝚗𝚐 ' + config.WORKTYPE + ' 𝚗𝚘𝚠 👻'));			
			console.log('bot is Working '+ config.WORKTYPE +' Now!')
			const msg = '*bot is Working '+ config.WORKTYPE +' Now! 👸*\n\n```Please do not try plugins here. This is your LOG number.```\n_You can use commands in any other chat :)_\n\n\nThanks for using Queen DIANA'
			

const buttonMessage = {
    image: {url: 'https://telegra.ph/file/3217c19d381ae34b38012.jpg'},
    caption: msg  }
await conn.sendMessage(conn.user.id, buttonMessage)
		}
	})
	
	conn.ev.on('creds.update', saveState)
	
	conn.ev.on('messages.upsert', async(mek) => {
		try {
			mek = mek.messages[0]
			if (!mek.message) return
			
			mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
			if (mek.key && mek.key.remoteJid === 'status@broadcast') return
			const type = getContentType(mek.message)
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			
			const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
			const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : ( type == 'listResponseMessage') && mek.message.listResponseMessage.selectedRowId? mek.message.listResponseMessage.selectedRowId : (type == 'buttonsResponseMessage') && mek.message.buttonsResponseMessage.selectedButtonId  ? mek.message.buttonsResponseMessage.selectedButtonId  : (type == "templateButtonReplyMessage") && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId  :  (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
			
			const isCmd = body.startsWith(prefix)
			const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
			
			const args = body.trim().split(/ +/).slice(1)
			const q = args.join(' ')
			const isGroup = from.endsWith('@g.us')
			const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
			const senderNumber = sender.split('@')[0]
			const botNumber = conn.user.id.split(':')[0]
			const pushname = mek.pushName || 'Sin Nombre'
			
			const isMe = botNumber.includes(senderNumber)
			const isOwner = ownerNumber.includes(senderNumber) || isMe
			       
			
			
			
			const reply = async(teks) => {
				await conn.sendMessage(from, { text: teks }, { quoted: mek })
			}
			const sendtempimg = async( text , button , imgurl ) => {
				await conn.sendMessage(from, { text: text , footer: '👸 QUEEN DIANA MD Version', templateButtons: button , image: {url:  imgurl } }, { quoted: mek })
			}
			const sendbutimg = async( text , button , imgurl ) => {
			          	await conn.sendMessage(from, { image: {url:imgurl  }, caption: text, footer: '👸 QUEEN DIANA MD Version', buttons: button , headerType: 4} , { quoted: mek })
		         }
				
			
			
			
			// precence 
			
			 if (config.NO_ONLINE) {
            await conn.sendPresenceUpdate('unavailable' , mek.key.remoteJid);
        }
			
			const msg = mek
			
			// Block chat 
			
			if (config.BLOCKCHAT !== false) {     
            var abc = config.BLOCKCHAT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT == '94769370897-1415817281') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT2 == '94769370897-1458298055') {     
            var tsup = config.SUPPORT2.split(',');                            
            if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT3 == '94769370897-1446476993') {     
            var nsup = config.SUPPORT3.split(',');                            
            if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.Support4 == '94769370897-1630672792') {     
            var nsup = config.Support4.split(',');                            
            if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.AMDI_1 == '94769370897-1533638214') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
       
         if (config.AMDI_3 == '94769370897-1631633729') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.AMDI_4 == '94769370897-1631905677') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.AMDI_5 == '94769370897-1636094186') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.AMDI_6 == '972542559113-1376904403') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
         if (config.AMDI_7 == '94769370897-1636286090') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
//===========================================================================
		events.commands.map(
			async (command) =>  {
				if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
					var text_msg = msg.message.imageMessage.caption;
				} else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
					var text_msg = msg.message.videoMessage.caption;
				} else if (msg.message) {
					var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
				} else {
					var text_msg = undefined;
				}
		
				if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
					&& msg.message && msg.message.imageMessage !== null && 
					(command.pattern === undefined || (command.pattern !== undefined && 
						command.pattern.test(text_msg)))) || 
					(command.pattern !== undefined && command.pattern.test(text_msg)) || 
					(command.on !== undefined && command.on === 'text' && text_msg) ||
					// Video
					(command.on !== undefined && (command.on === 'video')
					&& msg.message && msg.message.videoMessage !== null && 
					(command.pattern === undefined || (command.pattern !== undefined && 
						command.pattern.test(text_msg))))) {
		
					let sendMsg = false;
					var chat = conn.chats.get(msg.key.remoteJid)
						
					if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
						(msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
					) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
						if (command.onlyPinned && chat.pin === undefined) return;
						if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
						else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
					}
					
					else if ((config.MAHN !== false && msg.key.fromMe === false && command.fromMe === true &&
						(msg.participant && config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.MAHN || config.MAHN.includes(',') ? config.MAHN.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.MAHN)
					) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
						if (command.onlyPinned && chat.pin === undefined) return;
						if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
						else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
					}
		
					if (sendMsg) {
						if (config.SEND_READ && command.on === undefined) {
							await conn.chatRead(msg.key.remoteJid);
						}
						
						var match = text_msg.match(command.pattern);
						
						if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
						&& msg.message.imageMessage !== null) {
							whats = new Image(conn, msg);
						} else if (command.on !== undefined && (command.on === 'video' )
						&& msg.message.videoMessage !== null) {
							whats = new Video(conn, msg);
						} else {
							whats = new Message(conn, msg);
						}
		/*
						if (command.deleteCommand && msg.key.fromMe) {
							await whats.delete(); 
						}
		*/
					   
					}
				}
			}
		)
//==========================================================================================================================				
			// commands
			
			switch (command) {

case 'alive':
alive(conn ,mek )

break
					
					
	case 'menu':	
		reply('no menu')		
	break
					
				case 'owner' :
					const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:kavishka sandaruwan\n' // full name
            + 'ORG:Queen Diana;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=94773734317:+94 77 373 4316 \n' // WhatsApp ID + phone number
            + 'END:VCARD'
 await conn.sendMessage(
    from,
    { 
        contacts: { 
            displayName: 'kavishka sandaruwan (DIANA OWNEER)', 
            contacts: [{ vcard }] 
        }
    } , { quoted: mek }
)
					
					break
/*/================================================UPDATE=====================================================					
				case 'update now' :	
					if (!isMe) return
					 await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
         conn.sendMessage(from , { text: "no updates" }, { quoted: mek } )    
    } else {
    if (Config.HEROKU.HEROKU) {
            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
               reply('invalid heroku app name')
            }

            git.fetch('upstream', Config.BRANCH);
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', Config.BRANCH);

            conn.sendMessage(from , { text: "finish" }, { quoted: mek } )
            
        } 
    }
	break	
//===============================================CHECK UPDATE=========================================					
					
					case 'check update' :	
					if (!isMe) return
					 await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
       // reply('no updates')    
await  conn.sendMessage(from , { text: "no update" }, { quoted: mek } )
    } else {

        var newzels = "YOU HAVE NEW UPDATE \n\n ";
        commits['all'].map(
            (commit) => {
                newzels += '🔹 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' ◁◁' + commit.author_name + '▷▷\n';
            }
        );
      //  reply(ne
await  conn.sendMessage(from , { text: newzels }, { quoted: mek } )

    }
	break
//++++++++++++++++++++++++++++++++++++++++++++++UPDATE END+++++++++++++++++++++++++++++++++++++++++++++++++++	*/			
				        case 'song' : 
					song(  conn , mek , q)
					break
				        case 'dsong' :
					dsong(  conn , mek , q)
					break
					case 'asong' :
					asong(  conn , mek , q)
					break
					case 'getyt' : 
					getyt(conn , mek , q)
					break
				        case 'kick' :
					kick(conn , mek , q)
					break
					case 'react' : 
					react(  conn , mek , q)
					break
				       
				case 'emoji':
				emoji(conn , mek , q)
				break
				
	case 'fixupdate':
               updiana(conn , mek , q )
          break


  case 'hasupdate':
               fixdiana(conn , mek , q )
          break
					case 'add' :
					add(conn , mek , q)
					break
				        case 'video' :
					video(conn , mek , q)
					break
					case 'vid360' :
					yt360p(conn , mek , q)
					break
					case 'vid480' :
					yt480p(conn , mek , q)
					break
					case 'vid720' :
					yt720p(conn , mek , q)
					break
					case 'sticker' :
				        case 'stic' :
					sticker(conn ,mek ,q)
					break
					case 'setvar' :
					setvar(conn , mek ,q)
					break
			}
			
		} catch (e) {
			const isError = String(e)
			console.log( isError )
		
		}
	})
}

connectToWA()
