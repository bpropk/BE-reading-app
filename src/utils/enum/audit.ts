const historyType = {
  deposit: "deposit",
  widthdraw: "widthdraw",
  transfer: "transfer",
  buy: "buy",
};

const statusTransaction = {
  decline: "decline",
  accept: "accept",
  depositPending: "depositPending",
};

const telecomTransaction = {
  Viettel: "viettel",
  Mobifone: "mobiphone",
  Vinaphone: "vinaphone",
};

const telecomNumber = {
  viettel: "11111",
  mobiphone: "22222",
  vinaphone: "33333",
};

module.exports = {
  historyType,
  statusTransaction,
  telecomTransaction,
  telecomNumber,
};

export {};
