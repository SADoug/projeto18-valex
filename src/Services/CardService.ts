import bcrypt from "bcrypt";
import { faker } from '@faker-js/faker';
import * as CardRepository from '../Repositories/CardRepository';
import * as paymentRepository from '../Repositories/paymentRepository';
import * as RechargeRepository from '../Repositories/RechargeRepository';
import { findByApiKey } from '../Repositories/companyRepository';
import { findById } from '../Repositories/employeeRepository';
import dayjs from "dayjs";


async function CardInsert(cardholderName: string, password: string, isVirtual: boolean, originalCardId: number, isBlocked: boolean, type: any, employeeId: number, apiKey: string) {


  const apiVerification = await findByApiKey(apiKey)

  if (!apiVerification) { throw { type: "not_found", message: "invalid API KEY" } }

  const employeeCheck = await findById(employeeId)
  if (!employeeCheck) { throw { type: "not_found", message: "invalid employeeId" } }

  const employeeCardcheck = await CardRepository.findByTypeAndEmployeeId(type, employeeId)
  if (employeeCardcheck) { throw { type: "not_found", message: "invalid employeeId and card type" } }
  const cardNumber = faker.finance.account(16);

  function formatCardholderName(fullName: string) {
    const [firstName, ...otherNames] = fullName.split(" ");
    const lastName = otherNames.pop();
    const middleNames = otherNames.filter(filterTwoLetterMiddleName).map(getMiddleNameInitial);

    if (middleNames.length > 0) {
      return [firstName, middleNames, lastName].join(" ").toUpperCase();
    }

    return [firstName, lastName].join(" ").toUpperCase();
  }

  function getMiddleNameInitial(middleName: string) {
    return middleName[0];
  }

  function filterTwoLetterMiddleName(middleName: string) {
    if (middleName.length >= 3) return middleName;
  }
  let name = formatCardholderName(cardholderName)


  let expire = dayjs().add(5, "year").format("MM/YY");

  const securityCode = faker.finance.creditCardCVV();
  const SALT = 8;
  let encryptedString = bcrypt.hashSync(securityCode, SALT);
 console.log(securityCode)

  if (apiVerification) {

    let cardData = {
      employeeId,
      number: cardNumber,
      cardholderName: name,
      securityCode: encryptedString,
      expirationDate: expire,
      password,
      originalCardId,
      isVirtual,
      isBlocked,
      type

    }
    await CardRepository.insert(cardData)
  }

}


async function cardActivation(number: string, securityCode: string, password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "not_found", message: "invalid card number" } }
  var time = dayjs().format("MM/YY")

  if (cardCheck.expirationDate < time) { throw { type: "conflict", message: "Card expired" } }
  if (cardCheck.password != '') { throw { type: "conflict", message: "card already activated" } }
  const isCVCValid = bcrypt.compareSync(securityCode, cardCheck.securityCode);
  if (!isCVCValid) { throw { type: "conflict", message: "CVC invalid" } }
  const PASSWORD_FORMAT_4_DIGITS = /^[0-9]{4}$/;
  if (!PASSWORD_FORMAT_4_DIGITS.test(password)) throw { type: "bad_request", message: "invalid password" };

  let id = cardCheck.id
  let cardData = {
    password: hashedPassword,
  }
  await CardRepository.update(id, cardData)
}

async function cardPayment(number: string) {

  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "conflict", message: "card not registered" } }
  let id = cardCheck.id

  let result = transactions(id)
  async function transactions(cardId: number) {
    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await RechargeRepository.findByCardId(cardId);
    const balance = await getCardAmount(transactions, recharges);

    async function getCardAmount(payments: paymentRepository.PaymentWithBusinessName[], recharges: rechargeRepository.Recharge[]) {
      const totalPaymentAmount = payments.reduce(sumTransactionWithAmount, 0);
      const totalRechargeAmount = recharges.reduce(sumTransactionWithAmount, 0);
      return totalRechargeAmount - totalPaymentAmount;
    }

    return { balance: balance, transactions, recharges };
  }

  function sumTransactionWithAmount(amount: number, transaction: any) {
    return amount + transaction.amount;
  }
  return result
}

async function BlockCard(number: string, password: string) {

  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "conflict", message: "card does not exist" } }
  let time = dayjs().format("MM/YY")

  if (cardCheck.expirationDate < time) { throw { type: "conflict", message: "card already expired" } }
  let id = cardCheck.id
  if (cardCheck.isBlocked === true) { throw { type: "conflict", message: "card already blocked" } }

  let hashedPassword = cardCheck.password
  if (!bcrypt.compareSync(password, hashedPassword)) { throw { type: "conflict", message: "invalid password" } }

  let cardData = {
    isBlocked: true
  }
  CardRepository.update(id, cardData)

}
async function UnBlockCard(number: string, password: string) {

  const cardCheck = await CardRepository.findByNumber(number)
  if (!cardCheck) { throw { type: "conflict", message: "card does not exist" } }

  let time = dayjs().format("MM/YY")

  if (cardCheck.expirationDate < time) { throw { type: "conflict", message: "card already expired" } }
  let id = cardCheck.id
  if (cardCheck.isBlocked === false) { throw { type: "conflict", message: "card already blocked" } }

  let hashedPassword = cardCheck.password
  if (!bcrypt.compareSync(password, hashedPassword)) { throw { type: "conflict", message: "invalid password" } }

  let cardData = {
    isBlocked: false
  }
  CardRepository.update(id, cardData)

}
export {
  CardInsert,
  cardActivation,
  cardPayment,
  BlockCard,
  UnBlockCard
}