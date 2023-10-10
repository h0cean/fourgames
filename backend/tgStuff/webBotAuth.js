const crypto = require('crypto');
const TOKEN = process.env.TG_TOKEN;

const authData = async (socket)=>{
	
	try{
		const data  = transformInitData(socket.handshake.auth.initData);
		const validateResult = await validate(data, TOKEN);
		console.log('webbotAuth data:', data)
		if(validateResult === true){
			socket.webBotUser  = JSON.parse(data.user);
			socket.tgWebApptStartParam = data.start_param;
			// delete req.body.initData;
			// delete req.body.initDataUnsafe;;
			return true;
		}else{
			return false;
			
		}
		


	}catch(e){
		console.log('something went wrong', e);
		return false;
	}
}

function transformInitData(initData) {
    return Object.fromEntries(new URLSearchParams(initData));
}

// Accepts init data object and bot token
async function validate(data, botToken) {
    const encoder = new TextEncoder()

    const checkString = await Object.keys(data)
        .filter((key) => key !== "hash")
        .map((key) => `${key}=${data[key]}`)
        .sort()
        .join("\n")

    // console.log('computed string:', checkString)

    const secretKey = await crypto.subtle.importKey("raw", encoder.encode('WebAppData'), { name: "HMAC", hash: "SHA-256" }, true, ["sign"])
    const secret = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken))
    const signatureKey = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, true, ["sign"])
    const signature = await crypto.subtle.sign("HMAC", signatureKey, encoder.encode(checkString))

    const hex = [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, '0')).join('')

    // console.log('original hash:', data.hash)
    // console.log('computed hash:', hex)

    return data.hash === hex
}
module.exports = authData;