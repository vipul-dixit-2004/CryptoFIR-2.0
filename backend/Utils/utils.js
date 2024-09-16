const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY);

function encryptData(data) {
  const encryptedString = cryptr.encrypt(data);
  return encryptedString;
}

function decryptData(data) {
  const decryptedString = cryptr.decrypt(data);
  return decryptedString;
}

module.exports = {
  encryptData,
  decryptData,
};
