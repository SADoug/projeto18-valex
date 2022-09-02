import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { any } from "joi";
import { faker } from '@faker-js/faker';
import * as CardRepository from '../Repositories/CardRepository';
import { findByApiKey } from '../Repositories/companyRepository';
import { findById } from '../Repositories/employeeRepository';

async function CardInsert(number: string, cardholderName: string, securityCode: string, expirationDate: string, password: string, isVirtual: boolean, originalCardId: number, isBlocked: boolean, type: any, employeeId: number, apiKey: string) {
//Elaborar as regras de negócio 
//I) A chave de API deve ser possuida por alguma empresa
const apiVerification = await findByApiKey(apiKey)
console.log("API check",apiVerification)
//working
// II) Somente empregados cadastrados podem ter cartões
const employeeCheck = await findById(employeeId)
console.log("Employee check",employeeCheck)
//working
// III) Empregados não podem ter mais de um cartão do mesmo tipo
const employeeCardcheck = await CardRepository.findByTypeAndEmployeeId(type, employeeId)
console.log("Employee card check",employeeCardcheck)

//IV)Utilize a biblioteca faker para gerar o número do cartão
const cardNumber = faker.finance.account(16); 

//V) O nome no cartão deve estar no formato primeiro nome + iniciais de nomes do meio + ultimo nome (tudo em caixa alta). 
// Usar regex

// VI) A data de expiração deverá ser o dia atual 5 anos a frente e no formato MM/YY
// Usar um date now e somar mais 5 dias
// const expiration = dayjs().format('MM/YY') + 
// console.log(expiration)

var time = new Date();
var outraData = new Date();
outraData.setFullYear(time.getFullYear() + 5); 
console.log("Expiration date check", outraData.toString())
//Analisar opções melhores de transformar a data em string

//VII) O código de segurança (CVC) deverá ser persistido de forma criptografado, por ser um dado sensível
// Não receber isso na re, gerar ele aqui
const CVC = faker.finance.account(3); 
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const encryptedString = cryptr.encrypt(CVC);

console.log("CVC encriptografado",encryptedString)

if( apiVerification){
console.log("cheguei no final do card service")
  const hashedPassword = bcrypt.hashSync(password, 10);
  let cardData = {
    employeeId,
    number: cardNumber,
    cardholderName,
    securityCode: encryptedString,
    expirationDate,
    password: hashedPassword,
    isVirtual,
    originalCardId,
    isBlocked,
    type
  
  }
   CardRepository.insert(cardData)
}

}

export {
  CardInsert,
}