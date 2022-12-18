function genPassword() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const passwordLength = 12;
  let password = "";
  for (var i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}
function generateStudentPassword(record) {
  const { aadhar_number, name, whatsapp_mobile } = record;
  let password = "";
  if (aadhar_number) {
    password = `${aadhar_number.slice(-8)}`;
    return password;
  } else {
    password = "12345678";
    return password;
  }
}

module.exports = { genPassword, generateStudentPassword };
