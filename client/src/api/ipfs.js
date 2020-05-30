
// connect to ipfs daemon API server
//const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)

// or connect with multiaddr
//const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: '39.105.81.9', port: '5001', protocol: 'http'});
// or using options
//const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

export  const addText  = (text) => {
    return new Promise(function(resolve, reject) {
      const buffer = Buffer.from(text);
      ipfs.add(buffer).then((response) => {
        console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
    })
}
export const addImg = (reader) => {
    return new Promise(function(resolve, reject) {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer).then((response) => {
        //console.log(response)
        resolve(response[0].hash);
      }).catch((err) => {
        console.error(err)
        reject(err);
      })
    })
  }
export function get (hash){
    return new Promise((resolve,reject)=>{
        try{
            ipfs.get(hash,function (err,files) {
                if (err || typeof files == "undefined") {
                    reject(err);
                }else{
                    resolve(files[0].content);
                }
            })
        }catch (ex){
            reject(ex);
        }
    });
}

export function catText (hash) {
    let strContent = "";
    ipfs.cat(hash).then((stream) => {
        console.log(stream);
        strContent = Utf8ArrayToStr(stream);
        console.log(strContent);
    });
    return strContent
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
      {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
                         ((char2 & 0x3F) << 6) |
                         ((char3 & 0x3F) << 0));
          break;
        default:
          break;
      }
    }

    return out;
}