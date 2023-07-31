const fs = require('fs-extra')
const toMs = require('ms')
const ultah = JSON.parse(fs.readFileSync('./data.json'))

const addUltah = (nama, tgl) => {
  const obj = { Nama: nama, tanggal: tgl, hari: "belum" }
  ultah.push(obj)
  fs.writeFileSync('./data.json', JSON.stringify(ultah))
}

const hapusUltah = (nama, tgl) => {
  const filteredArr = arr.filter(obj => !(obj.Nama === nama && obj.tanggal === tanggal));

  const p = arr.indexOf(filteredArr[0])
  ultah.splice(p)
  fs.writeFileSync('./data.json', JSON.stringify(ultah))
}

const date = new Date();
const options = { month: '2-digit', day: '2-digit', timeZone: 'Asia/Jakarta' };
const optionss = { day: '2-digit', timeZone: 'Asia/Jakarta' };
const currentDateNew = date.toLocaleString('id-ID', options);
const currentDay = date.toLocaleString('id-ID', optionss);
const [dd, mm] = currentDateNew.split("/");
const currentDate = `${mm}/${dd}`;

function change(re) {
  const tanggalArray = re.split("/");
  const tanggalBaru = tanggalArray[0] + "/" + tanggalArray[1];
  return tanggalBaru
}

function kedua(re) {
  const te = re.split("/")
  const tb = te[1]
  const tp = parseInt(tb)
  const tl = tp;
  const ti = te[0] + "/" + tl.toString()
  return tl;
}


const sudah = (obj) => {
  setInterval(() => {
    let position = null
    Object.keys(obj).forEach((i) => {
      if ("sudah" === obj[i].hari) {
        position = i
      }
    })
    if (position !== null) {
      if (parseInt(currentDay) > parseInt(kedua(obj[position].tanggal))) {
        obj[position].hari = "belum"
        fs.writeFileSync('./data.json', JSON.stringify(obj))
      }
    }
  }, 5000)
}



const hariUltah = (conn, participants, obj) => {
  setInterval(() => {
    let position = null
    Object.keys(obj).forEach((i) => {
      if (change(obj[i].tanggal) === currentDate) {

        position = i
      }
    })
    if (position !== null) {
      if (obj[position].hari === "belum") {
        var options = {
          text: `Happy Birthday ${obj[position].Nama}!
Doa yang terbaik untuk kamu yaa!
Jika memang traktiran makan terlalu berat, shopeepay 50 ribu saja tak apa-apa.
Sekali lagi Happy Birthday jodohnya KIM NAMJOON KIM SEOKJIN MIN YOONGI JUNG HOSEOK PARK JIMIN KIM TAEHYUNG JEON JUNGKOOK BTS! 💜💜💜

young forever 90's`,
          mentions: participants.map(a => a.id)
        }
        conn.sendMessage("6283172168552-1633339886@g.us", options)
        obj[position].hari = "sudah"
        fs.writeFileSync('./data.json', JSON.stringify(obj))
      }
    }
  }, 5000)
}

module.exports = {
  addUltah,
  sudah,
  hapusUltah,
  hariUltah
}
