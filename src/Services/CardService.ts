import bcrypt from "bcrypt";
import * as CardRepository from '../Repositories/CardRepository';



async function CardInsert({ number , cardholderName , securityCode, expirationDate, password, isVirtual, originalCardId, isBlocked, type, employeeId }) {
   
  const hashedPassword = bcrypt.hashSync(password, 10);

  return CardRepository.insert({
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password: hashedPassword,
    isVirtual,
    originalCardId,
    isBlocked,
    type,
    employeeId,
  });
}

export {
    CardInsert,
}