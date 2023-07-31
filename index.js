const fs = require('fs-extra')
const {  default: makeWASocket, DisconnectReason,  useMultiFileAuthState, generateForwardMessageContent, downloadContentFromMessage, proto, generateWAMessageFromContent, generateWAMessage, areJidsSameUser, makeInMemoryStore, jidDecode, Browsers } = require("@whiskeysockets/baileys")
const cron = require('node-cron');
const pino = require('pino')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const dataconfess = JSON.parse(fs.readFileSync('confess.json'))
const moment = require('moment-timezone')
const { addUltah, hariUltah, hapusUltah, sudah } = require('./lib/ultah')
const ultahnya = JSON.parse(fs.readFileSync('data.json'))
const smk = JSON.parse(fs.readFileSync('smk.json'))
const story = JSON.parse(fs.readFileSync('story.json'))
const website = JSON.parse(fs.readFileSync('web.json'))

moment.tz.setDefault('Asia/Jakarta').locale('id')
const { Sticker } = require('wa-sticker-formatter')
const speed = require('performance-now')
const axios = require('axios')
const express = require('express')
const multer = require('multer')
const secure = require('ssl-express-www');
const cors = require('cors');
const bodyParser = require('body-parser');



const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })


store.readFromFile('./baileys_store1.json')
// saves the state to a file every 10s
setInterval(() => {
  store.writeToFile('./baileys_store1.json')
}, 10_000)


sizeLimit = (str, max) => {
      let data
      if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
         oversize: true
      }
      if (str.match('M') || str.match('MB')) {
         let first = str.replace(/MB|M|G|T/g, '').trim()
         if (isNaN(first)) return data = {
            oversize: true
         }
         if (first > max) return data = {
            oversize: true
         }
         return data = {
            oversize: false
         }
      } else {
         return data = {
            oversize: false
         }
      }
   }


function getRandomApi() {
  // Get a random index from the array
  const randomIndex = Math.floor(Math.random() * apikey.length);
  // Return the string at the random index
  return apikey[randomIndex];
}

const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`
          }

 async function getChat(message){
    return new Promise(async (resolve, reject) => {
    const dataai = await axios.get("https://api.lolhuman.xyz/api/openai?apikey=df9019234034a5d713424f23&text=" + message + "&user=user-unique-id")
    if (!dataai) return reject("error")
    resolve(dataai.data.result)
    })
} 

const getStoryPosition = (userId) => {
    let position = null
    Object.keys(story).forEach((i) => {
        if (story[i].from === userId) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

const getSenderPosition = (userId) => {
    let position = null
    Object.values(story).forEach((i) => {
        if (i.data.includes(userId)) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}


async function getCuaca(kota) {
    return new Promise(async (resolve, reject) => {
    const dataCuaca = await axios.get("https://api.lolhuman.xyz/api/cuaca/" + kota + "?apikey=df9019234034a5d713424f23")
    let text = `*[CUACA DI KOTA ${kota}]*\n`.toUpperCase()
    let data = []
    let dataApi = []
    if (!dataCuaca) reject(false)
    Object.keys(dataCuaca.data.result).map((data2) => {
        if (data2 == "Clouds"){
            cuacaApi = "Berawan";
        } else if (data2 == "Rain"){
            cuacaApi = "Hujan"
        }
        data.push(data2)
    })
    Object.values(dataCuaca.data.result).map((data) => {
        dataApi.push(data)
    })
    for (let i = 0; i < data.length; i++){
    text += `=> ${data[i]} *${dataApi[i]}*\n`;
    }
    resolve(text)
    })
}

async function getImage(query){
  const getBuffer3 = async (url, options) => {
              try {
                options ? options : {}
                const res = await axios({
                  method: "get",
                  url,
                  headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                  },
                  ...options,
                  responseType: 'arraybuffer'
                })
                return res.data
              } catch (e) {
                console.log(`Error : ${e}`)
              }
            }
    return new Promise(async (resolve,reject) => {
    const buffer = await getBuffer3("https://api.lolhuman.xyz/api/dall-e?apikey=df9019234034a5d713424f23&text=" + query)
    if (!buffer) return reject("error")
    resolve(buffer)
    })
}


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(secure);
app.get('/', (req, res) => {
  res.send('Hello World!')
})



async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  __path = process.cwd()


  const getGroupAdmins = (participants) => {
    admins = ["6281414046576@s.whatsapp.net"]
    for (let i of participants) {
      i.admin === "admin" || i.admin === "superadmin" ? admins.push(i.id) : ''
    }
    return admins
  }

  const get = (from, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
      if (_dir[i].id === from) {
        position = i
      }
    })
    if (position !== null) {
      return position
    }
  }


  const checkgroup = (userId, _dir) => {
    let status = false
    Object.keys(_dir).forEach((i) => {
      if (_dir[i].id === userId) {
        status = true
      }
    })
    return status
  }


  async function newsticker(img) {
    const stickerMetadata = {
      type: 'full', //can be full or crop
      pack: 'punya',
      author: 'piyo',
      categories: 'deswita',
    }
    return await new Sticker(img, stickerMetadata).build()
  }

  const checkteks = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
      if (_dir[i].id === userId) {
        position = i
      }
    })
    if (position !== null) {
      return _dir[position].text
    }
  }

  const conn = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    getMessage: async key => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
      }

      // only if store is present
      return {
        conversation: 'hello'
      }
    }
  })






  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log('Koneksi Terputus...')
    } else {
      console.log('Koneksi Terhubung...')
    }
  })


  app.post('/confess', multer().none(), async (req, res) => {
    let nomor = req.body.to
    console.log('Confes Datangg dari ' + nomor)
    let text = req.body.message
    if (nomor.startsWith('08')) {
      nomor = nomor.replace('08', "628")
    }
    nomor = nomor + "@s.whatsapp.net"
    const [result] = await conn.onWhatsApp(nomor)
    if (!result) return
    if (result.exists) {
      let texp = `Message : ${text}\n\nBot Confess\nCheck In https://piyo.my.id`
      conn.sendMessage(nomor, { text: texp })
      dataconfess.push({
        from: req.body.from,
        to: nomor,
        message: text
      })
      fs.writeFileSync('confess.json', JSON.stringify(dataconfess))
      return res.jsonp({ data: "Berhasil Kirim Pesan" })
    } else {
      return res.jsonp({ data: "Nomor Tidak Ada Di whatsapp " })
    }
  })





  app.post('/verif', multer().none(), async (req, res) => {
    const getBuffer = async (url, options) => {
      try {
        options ? options : {}
        const res = await axios({
          method: "get",
          url,
          headers: {
            'DNT': 1,
            'Upgrade-Insecure-Request': 1
          },
          ...options,
          responseType: 'arraybuffer'
        })
        return res.data
      } catch (e) {
        console.log(`Error : ${e}`)
      }
    }
    let textveri;
    let textveri2;
    if (req.body.link.includes('forgot')) {
      textveri = "Forgot Password"
      textveri2 = "Click This For Go To Change Your Password"
    } else {
      textveri = "Verfiy"
      textveri2 = "Please Verify Your Account"
    }
    phone = req.body.phoneNumber;
    phone = phone.replace("08", "628")
    const template = [
      { index: 1, urlButton: { displayText: textveri, url: req.body.link } }
    ]
    const templateMessage = {
      viewOnceMessage: {
        message: {
          templateMessage: {
            hydratedTemplate: {
              hydratedContentText: textveri2,
              hydratedFooterText: "PiyoW-API",
              hydratedButtons: template
            }
          }
        }
      }
    }
    await conn.relayMessage(phone + "@s.whatsapp.net", templateMessage, {})
    res.jsonp({ status: "success" })
  })
  conn.ev.on('messages.upsert', async chatUpdate => {
    try {
      m = chatUpdate
      m = m.messages[0]
      if (!m.message) return
      if (m.key.fromMe) return
      const content = JSON.stringify(m.message)
      m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
      let type = Object.keys(m.message)
      type = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) || (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) || type[type.length - 1] || type[0]
      const from = m.key.remoteJid
      const isGroup = from.endsWith('@g.us')
      const botNumber = conn.user.id ? conn.user.id.split(":")[0] + "@s.whatsapp.net" : conn.user.id
      const budo = (type === 'conversation' && m.message.conversation.startsWith('.')) ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.title || m.text) : ''
      const budy = (type === 'conversation') ? m.message.conversation : ''
      const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.title || m.text) : ''
      const bude = (type === 'conversation' && m.message.conversation.startsWith('.')) ? m.message.conversation : ''
      const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
      const groupMembers = isGroup ? await groupMetadata.participants : ''
      const groupName = isGroup ? groupMetadata.subject : ''
      const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : ''
      const participants = isGroup ? await groupMetadata.participants : ''
      const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false
      const sender = isGroup ? m.key.participant : m.key.remoteJid
      const isGroupAdmins = isGroup ? groupAdmins.includes(sender) || from === "6281414046576@s.whatsapp.net" : false
      const args = body.trim().split(/ +/).slice(1)
      const argss = bude.trim().split(/ +/).slice(1)
      const ownernumber = '6281414046576@s.whatsapp.net'
      const isOwner = from == ownernumber
      const command = budo.slice(1).trim().split(/ +/).shift().toLowerCase()

      const q = args.join(' ')
      const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
      const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
      const isQuoted = type === 'extendedTextMessage' && content.includes('text')

      const reply = (text) => {
        conn.sendMessage(from, {
          text: text
        })
      }
      await sudah(ultahnya);
      await hariUltah(conn, participants, ultahnya);


      if (isGroup) {
        let y = m
        if (y.message.conversation.length > 40000) {
          conn.sendMessage(from, { delete: y.key })
          conn.groupParticipantsUpdate(from, [t.key.participants], "remove")
        }
      }
      



      global.data = global.data ? global.data : []
      global.conns = global.conns ? global.conns : []

      if (type === "conversation" || type === "extendedTextMessage") {
        if (body.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
          if (isOwner) {
            try {
              join = body.split('https://chat.whatsapp.com/')[1]
              await conn.groupAcceptInvite(join).then(async (data) => {
                await conn.sendMessage(from, { text: 'Succes Join To Grup' })
              })
            } catch (err) {
              console.log(err)
            }
          } else {
            let t = m
            const pe = JSON.parse(fs.readFileSync('anti.json'))
            if (!pe.includes(from)) return
            if (isGroupAdmins) return
            await conn.sendMessage(from, { text: "*Anti Link*\n\nDilarang Mengirimkan Link Grup Lain" }, { quoted: t })
            await conn.sendMessage(from, { delete: t.key })
            await conn.groupParticipantsUpdate(from, [sender], "remove")
          }
        }
      }

      if (from === "6285784631102@s.whatsapp.net") {
        if (body.length !== 0) {
          const p = await axios.get('https://api.lolhuman.xyz/api/simi?apikey=eaec2799935013be72f52472&text=' + body)
          reply(p.data.result)
        }
      } else {

        if (body == '.' || body == 'lazada' || body === 'tagall' || body == ".dor" || body == ".light") {
          if (isGroup && isGroupAdmins) {
            teks = (args.length > 1) ? body.slice(8).trim() : ''
            teks += `  Total : ${groupMembers.length}\n`
            for (let mem of groupMembers) {
              teks += `╠➥ @${mem.id.split('@')[0]}\n`
            }
            conn.sendMessage(from, { text: '╔══✪〘 Mention All 〙✪══\n╠➥' + teks + `╚═〘 ${groupName} 〙`, mentions: participants.map(a => a.id) })
          }
        }
        if (isGroupAdmins) {
          const cmd = bude.slice(1).trim().split(/ +/).shift().toLowerCase()
          const wel = JSON.parse(fs.readFileSync('welcome.json'))
          const q = argss.join(' ')
          if (cmd === "welcome") {
            if (checkgroup(from, wel) === true) {
              let posi = wel[get(from, wel)]
              posi.text = q
              fs.writeFileSync('welcome.json', JSON.stringify(wel, null, '\t'))
              conn.sendMessage(from, { text: 'sukses' })
            } else {
              obj = { id: from, text: q }
              wel.push(obj)
              fs.writeFileSync('welcome.json', JSON.stringify(wel, null, '\t'))
              conn.sendMessage(from, { text: 'sukses' })
            }
          }
        }

        if (body === ".anti") {
          if (!isGroupAdmins) return
          const per = m
          const pe = JSON.parse(fs.readFileSync('anti.json'))
          if (pe.includes(from)) {
            let tep = pe.indexOf(from)
            pe.splice(tep, 1)
            fs.writeFileSync('anti.json', JSON.stringify(pe))
            return conn.sendMessage(from, { text: "Sukses Matikan Shield Groupp" }, { quoted: per })
          }
          pe.push(from)
          fs.writeFileSync('anti.json', JSON.stringify(pe))
          conn.sendMessage(from, { text: "Sukses Aktifkan Shield Group" }, { quoted: per })
        }


        if (body === "test5") {
          console.log(from)
        }


        if (body === "haha") {
          console.log(conn.user[from])
        }




        if (body == "speed") {
          const timestampi = speed();
          const latensip = speed() - timestampi
          conn.sendMessage(from, { text: `${latensip.toFixed(4)} Second` })
        }

        if (body === "test4") {
          reply("Test yo")
        }


        if (body == "halo") {
          if (isGroup && isGroupAdmins) {
            var options = {
              text: 'halo semua',
              mentions: participants.map(a => a.id)
            }
            conn.sendMessage(from, options)
          }
        }
        if (body == "halo2") {
          if (isGroup && isGroupAdmins) {
            var options = {
              text: 'jajan yuk gais',
              mentions: participants.map(a => a.id)
            }
            conn.sendMessage(from, options)
          }
        }

        const sleep = async (ms) => {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        // if (body === "sstest") {
        //   console.log('test')
        //   var captureRequest = {
        //     url: "https://Bot100k.piyoxz.repl.co",
        //     webdriver: 'chrome',
        //     viewport: '1280x1024',
        //     fullpage: false,
        //     javascript: true
        //   };
        //   ScreenshotApi.getScreenshotReturningTemporaryUrl(
        //     API_KEY,        // your api key
        //     captureRequest, // the site to capture and your settings
        //     './'            // local path to store the screenshot png
        //   )
        //     .then(async (url) => {
        //       await conn.sendMessage(from, { image: { url: url } })
        //     })
        //     .catch((err) => {
        //       console.error('Error capturing screenshot:', err);
        //     })
        // 


        if (body == "haechan" || body === "bestie" || body === "cilukba") {
          if (isGroup && isGroupAdmins) {
            conn.sendPresenceUpdate('composing', from)
            ini_buffer = await fs.readFileSync('haechan.webp');
            conn.sendMessage(from, { sticker: ini_buffer, mentions: participants.map(a => a.id) })
          }
        } else if (body == "Piyak" || body == "piyak" || body === ".piw") {
          if (isGroup && isGroupAdmins) {
            conn.sendPresenceUpdate('composing', from)
            ini_buffer = await fs.readFileSync('2.webp');
            conn.sendMessage(from, { sticker: ini_buffer, mentions: participants.map(a => a.id) })
          }
        }

        if (body === "/start") {

          let text = `Menu BOT SMKN 2 KOTA BEKASI
          
        
1.Info Lowongan Kerja / Magang BKK
2.Informasi Sekolah

Note: Ketik Angka Menu
Example: Ketik 1 Untuk Melihat Info Lowongan Kerja / Magang BKK`
          conn.sendMessage(from, { text: text })
          if (smk.includes(from)) return
          smk.push(from)
          fs.writeFileSync('smk.json', JSON.stringify(smk))
        }

        if (body !== null) {
          let smkk = JSON.parse(fs.readFileSync('smk.json'))
          let dataw = smkk.includes(from)
          if (dataw) {
            if (body == 1) {
              try {
                await conn.sendMessage(from, {text: "Tunggu Sebentar Sedang Di Ambil Data"})
                const p = await axios.get('https://piyo.my.id/bkk')
                if (!p) return conn.sendMessage(from, { text: "Api Sedang Error" })
                for (let i = 0; i < p.data.data.length; i++) {
                  let textveri2 = `Perusahaan : ${p.data.data[i].pt}\nPosisi : ${p.data.data[i].posisi}\n\nCheck In https://bkk-smkn2kotabekasi.com/#lowongan`
                  console.log(p.data.data[i])
                  await conn.sendMessage(from, {
                    image: { url: p.data.data[i].img },
                    caption: textveri2,
                  })
                }
              } catch (err) {
                return conn.sendMessage(from, { text: "Api Sedang Error" })
              }
            }
          }
        }




        if (body === "tage") {
          const requestPaymentMessage = {
            amount: {
              currencyCode: "IDR",
              offset: 0,
              value: 9.99
            },
            expiryTimestamp: 0,
            amount1000: (9.99) * 1000,
            currencyCodeIso4217: "IDR",
            requestFrom: '0@s.whatsapp.net',
            noteMessage: {
              extendedTextMessage: {
                text: 'Example Payment Message'
              }
            }
          };
          return conn.relayMessage(from, { requestPaymentMessage }, {});
        }

        if (body === "hidetag") {
          if (!isGroup) return reply('Harus Di Grup')
          if (!isGroupAdmins) return
          var opsi = {
            text: '',
            mentions: participants.map(a => a.id)
          }
          conn.sendMessage(from, opsi)
        }


        switch (command) {
          case 'tag':
            if (!isGroup) return reply('Harus Di Grup')
            if (!isGroupAdmins) return
            var options = {
              text: q,
              mentions: participants.map(a => a.id)
            }
            conn.sendMessage(from, options)
            break
          case 'quizizz':
            if (!q) return reply('ketik .quiziz linknya atau pinnya')
            const regex = /^https?:\/\/(?:www\.)?quizizz\.com\/[^\s]+$/;
            const isQuizizzURL = regex.test(q);
            if (!isQuizizzURL) return conn.sendMessage(from, { text: "Link Tidak Benar" })
            let obj = {
              pin: q
            }
            await fetch('https://piyo.my.id/hack', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(obj)
            })
              .then(async (result) => {
                const content = await result.json();
                if (content.status === 400) return conn.sendMessage(from, { text: content.message })
                const sendMsg = await conn.sendMessage(from, { text: `*Quizizz Berhasil Di Hack*\n\nSilahkan Cek Link Dibawah Untuk Mengambil Jawaban\n\n${content.url}` })
              }).catch(() => {
                conn.sendMessage(from, { text: "Link / Id Quizizz Tidak Ditemukan" })
              })
            break;

          case 'gambar':
            if (!q) return reply('ketik .gambar textnya')
            const gm = m
            await conn.sendMessage(from, { text: "Tunggu Sebentar" }, { quoted: gm })
            await axios.get('https://piyo.my.id/open-gambar?gambar=' + q, {
              responseType: 'arraybuffer'
            }).then((result) => {
              let arb = result.data;
              return conn.sendMessage(from, { image: arb })
            }).catch((err) => {
              return conn.sendMessage(from, { text: "Gambar Tidak Di Temukan" }, { quoted: gm })
            })
            break;

        


          case 'ttp':
            const sti = await axios.get('https://botcahx.ddns.net/api/maker/attp?text=' + q)
            console.log(sti)
            await fs.writeFileSync(`./media/image/${q}.gif`, sti.result.data)
            const resultt = await newsticker(`./media/image/${q}.gif`)
            await conn.sendMessage(from, { sticker: resultt, isAnimated: true }, { quoted: m })
            fs.unlinkSync(`./media/image/${q}`)
            break
          case 'menu':
            menu = `╔══✪ 〘 *MENU PIYOBOT* 〙✪══
╠➥  .sticker
╠➥  .getsticker textnya berapa
╠➥  .twitter linknya
╠➥  .welcome textnya 
╠➥  .tag textnya
╠➥  .open
╠➥  .close
╠➥  .anti
╠➥  tagall
╠➥  hidetag\n`
            if (isGroup) {
              if (q) {
                if (!isGroupAdmins) return
                menu += "╠➥  " + q
                conn.sendMessage(from, { text: menu + `\n╚═〘 ${groupName} 〙` })
              } else {
                conn.sendMessage(from, { text: menu + `╚═〘 ${groupName} 〙` })
              }
            } else {
              conn.sendMessage(from, { text: menu + `╚═〘 Piyobot 〙` })
            }
            break;
          case 'hapus':
            if (!isGroup) return reply('Harus Di Grup')
            if (!isGroupAdmins) return
            if (!q) return reply("Cara Penggunaan:\n\n.hapus Piyo,15/01")
            if (!q.includes(",")) return reply("Cara Penggunaan:\n\n.hapus Piyo,15/01")
            const parts1 = q.split(",")
            const nama1 = parts1[0]
            const tanggal1 = parts1[1]
            await hapusUltah(nama1, tanggal1)
            reply("Sukses")
            break;


            case 'cuaca':
                    let p =  m
                    if (!q) return reply("Masukan Kota\nContoh : !cuaca bogor")
                    await getCuaca(q).then(async (data) => {
                        await conn.sendMessage(from, {text: data} , {quoted: p})
                    }).catch(async (err) => {
                        await conn.sendMessage(from, {text: "Error / Data Tidak Valid"} , {quoted: p})
                    })
                break;

            case 'ai':
                    let ai = m
                    if (!q) return reply("Kasih Bot Pertanyaan\nContoh : !ai Siapa Presiden Indonesia Sekarang")
                    await getChat(q).then(async (data) => {
                        let text = "*[PIYOBOT AI]*\n"
                        text += "Answer => " + data 
                        await conn.sendMessage(from, {text: text}, {quoted : ai})
                    }).catch(async (err) => {
			return await conn.sendMessage(from, {text : "Error / Data Tidak Valid"}, {quoted: ai})
		              })  
                break;

            case 'img':
                let aiimg = m
                if (!q) return reply("Kirim query gambar ke bot\nContoh : !img Orang Pintar")
                await getImage(q).then(async (data) => {
                    let texte = "*[PIYOBOT AI]*\n"
                    texte += "Image Generator AI : " + q
                    await conn.sendMessage(from, {image: data, caption : texte} , {quoted: aiimg})
                }).catch(async (err) => {
                    return await conn.sendMessage(from, {text: "Error / Data Tidak Valid"} , {quoted: aiimg})
                })
                break;

          case 'tambah':
            if (!isGroup) return reply('Harus Di Grup')
            if (!isGroupAdmins) return
            if (!q) return reply("Cara Penggunaan:\n\n.tambah Piyo,01/15")
            if (!q.includes(",")) return reply("Cara Penggunaan:\n\n.tambah Piyo,01/15")
            const parts = q.split(",")
            const nama = parts[0]
            const tanggal = parts[1]
            await addUltah(nama, tanggal)
            reply("Sukses")
            break;
          case 'sad':
            try {
              const getBuffer = async (url, options) => {
                try {
                  options ? options : {}
                  const res = await axios({
                    method: "get",
                    url,
                    headers: {
                      'DNT': 1,
                      'Upgrade-Insecure-Request': 1
                    },
                    ...options,
                    responseType: 'arraybuffer'
                  })
                  return res.data
                } catch (e) {
                  console.log(`Error : ${e}`)
                }
              }
              const ApiVideo = "https://hahaha.piyoxz.repl.co"
              const ResultData = await axios.get(ApiVideo)
              conn.sendMessage(from, { video: await getBuffer(ResultData.data[0].url), caption: "Video Random #" + ResultData.data[0].id })
            } catch (err) {
              reply("Tidak Ada Kesedihan hari ini");
            }
            break
          case 'twitter':
            if (!q) return reply("ketik /tiwtter linknya")
            try {
              const twt = await axios.get('https://api.lolhuman.xyz/api/twitter2?apikey=6db7e0c767bd9e84d1785be8&url=' + q)
              const tw = twt.data.result
              const func = async (url) => {
                const response = await axios(url, { responseType: 'arraybuffer' })
                const buffer64 = Buffer.from(response.data, 'binary').toString('base64')
                return buffer64
              }
              conn.sendMessage(from, { video: { url: tw.link[0].url }, jpegThumbnail: func(tw.thumbnail) })
            } catch (err) {
              conn.sendMessage(from, { text: 'Error Downloads' + err });
            }
            break
          case 'getsticker':
            if (!q) return reply("caranya adalah ketik .getsticker cariapa berapa");
            se = q
            se = se.split(' ')
            if (se[1] == null || se[1] == "" || se[1] == undefined) return reply("caranya adalah ketik .getsticker cariapa berapa");
            if (se[1] > 10) return reply("terlalu banyak hehehe");
            try {
              const gt = await axios.get('https://api.lolhuman.xyz/api/stickerwa?apikey=6db7e0c767bd9e84d1785be8&query=' + se[0])
              gte = gt.data.result[0].stickers
              for (let i = 0; i < se[1]; i++) {
                const result = await newsticker(gte[i])
                conn.sendMessage(from, { sticker: result })
              }
              conn.sendMessage(from, { text: 'selesai' })
            } catch (err) {
              conn.sendMessage(from, { text: 'Error' })
            }
            break

          case 's':
          case 'sticker':
            if (type === 'videoMessage' || isQuotedVideo) return reply('Image Only')
            const testt = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo.message.imageMessage : m.message.imageMessage
            const stream = await downloadContentFromMessage(testt, 'image')
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
              buffer = Buffer.concat([buffer, chunk])
            }
            ran = getRandom('.jpeg')
            await fs.writeFileSync(`./media/image/${ran}`, buffer)
            const result = await newsticker(`./media/image/${ran}`)
            await conn.sendMessage(from, { sticker: result })
            fs.unlinkSync(`./media/image/${ran}`)
            break
          case 'test':
            break
          case 'kick':
            if (isGroup && isGroupAdmins) {
              if (!isBotGroupAdmins) return reply("Bot Bukan Admin")
              if (m.message.extendedTextMessage === undefined || m.message.extendedTextMessage === null) return reply("caranya ketik /kick @mention")
              mentioned = m.message.extendedTextMessage.contextInfo.mentionedJid
              const response = await conn.groupParticipantsUpdate(
                from,
                mentioned,
                "remove"
              )
              conn.sendMessage(from, { text: "Sukses Kick" })
            } else {
              conn.sendMessage(from, { text: "Kamu Bukan Admin" });
            }
            break
          case 'open':
            if (isGroup && isGroupAdmins) {
              if (!isBotGroupAdmins) return reply("Bot Bukan Admin")
              await conn.groupSettingUpdate(from, 'not_announcement')
              conn.sendMessage(from, { text: "Sukses Open Group", mentions: participants.map(a => a.id) })
            } else {
              conn.sendMessage(from, { text: "Kamu Bukan Admin" });
            }
            break
          case 'close':
            if (isGroup && isGroupAdmins) {
              if (!isBotGroupAdmins) return reply("Bot Bukan Admin")
              await conn.groupSettingUpdate(from, 'announcement')
              conn.sendMessage(from, { text: "Sukses Close Group", mentions: participants.map(a => a.id) })
            } else {
              conn.sendMessage(from, { text: "Kamu Bukan Admin" });
            }
            break
          default:
        }
      }
    } catch (err) {
      console.log(err.message)
    }
  })

  conn.ev.on('creds.update', saveCreds)

  store.bind(conn.ev)


  conn.ev.on('group-participants.update', async mem => {
    let pek = mem.participants.toString()
    if (!pek.startsWith('62' || '60')) {
      await conn.sendMessage(mem.id, { text: "Orang Luar Terdeteksi\n\nOtomatis Kick" })
      return await conn.groupParticipantsUpdate(mem.id, [mem.participants], "remove")
    }
    parseMention = (text = '') => {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    const gp = JSON.parse(fs.readFileSync('welcome.json'))
    isGroup = mem.id.endsWith('@g.us')
    if (checkgroup(mem.id, gp) === true) {
      if (mem.action == 'add') {
        const teks2 = await checkteks(mem.id, gp)
        await conn.sendMessage(mem.id, { text: teks2 })
      }
    }
    const groupMetadata = isGroup ? await conn.groupMetadata(mem.id) : ''
    const groupMembers = isGroup ? await groupMetadata.participants : ''
    const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : ''

    if (mem.id === "120363040291467791@g.us") {
      if (mem.action == 'add') {
        teks4 = `welcome to My Time

Pertanyaan seputar orderan bisa menghubungi  @6285855259901 atau @6289521855655

Enjoy your time with mytime 🤍`
        await conn.sendMessage("120363040291467791@g.us", { text: teks4, mentions: groupAdmins.map(a => a) })
      }
    }
    if (mem.id === "6281270278196-1630299263@g.us") {
      if (mem.action == 'add') {
        const teks3 = `*HALO YANG BARU MASUK DI GRUP ARMY BANGTAN FAMILY*
   *semoga betahh yahh*
❗  *DI BAF wajib save no ADMIN disini ada 4 ADMIN*
❗  *pc LEADER stan kamu*
❗  *Dilarang spam yang tidak jelas*
❗  *Wajib nimbrung, jika ada halangan silahkan hubungi admin*
❗   *Absen setiap hari link ada di info grup*`
        await conn.sendMessage(mem.id, { text: teks3, mentions: groupAdmins.map(a => a) })
      }
    } else if (mem.id === "120363025082227077@g.us") {
      if (mem.action == 'add') {
        const getBuffer = async (url, options) => {
          try {
            options ? options : {}
            const res = await axios({
              method: "get",
              url,
              headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
              },
              ...options,
              responseType: 'arraybuffer'
            })
            return res.data
          } catch (e) {
            console.log(`Error : ${e}`)
          }
        }
        size = groupMetadata.size
        size = parseInt(size)
        const pp = await getBuffer('https://piyo-api.piyoxz.repl.co/welcome?size=' + size)
        const caption = `Selamat Datang @${mem.participants[0].split('@')[0]}`
        await conn.sendMessage(mem.id, { image: pp, caption: caption, mentions: [mem.participants[0]] })
      }
    }
  })

}



start()

app.listen(5000, '0.0.0.0', function() {
  console.log(`Example app listening at http://localhost:${port}`)
})
