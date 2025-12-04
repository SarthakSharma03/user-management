import bcrypt from 'bcrypt'
// const ENCRYPTION_KEY =process.env.KEY; 
// export function encrypt(text) {
//   if (text === undefined || text === null) return '';
//   text = String(text);
//   let result = '';
//   for (let i = 0; i < text.length; i++) {
//     const charCode = text.charCodeAt(i);
//     const keyCharCode = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
//     result += String.fromCharCode(charCode + keyCharCode);
//   }

//   const base64 = Buffer.from(result, 'utf8').toString('base64');
//   return `enc:${base64}`;
// }


// export function decrypt(encryptedText) {
//   if (!encryptedText) return '';
//   try {
//     if (typeof encryptedText !== 'string' || !encryptedText.startsWith('enc:')) {
//       return String(encryptedText);
//     }
//     const payload = encryptedText.slice(4);
    
//     const decoded = Buffer.from(payload, 'base64').toString('utf8');
//     let result = '';
//     for (let i = 0; i < decoded.length; i++) {
//       const charCode = decoded.charCodeAt(i);
//       const keyCharCode = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
//       result += String.fromCharCode(charCode - keyCharCode);
//     }
//     return result;
//   } catch (error) {
//     console.error('Decryption error:', error.message);
//     return '';
//   }
// }

export const encrypt = (password) => {
  const salt = 5;
  try {
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("error", err);
    return "";
  }
}

