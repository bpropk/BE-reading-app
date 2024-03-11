const UserRole = {
  Admin: 1000,
  User: 1,
};

const UserStatus = {
  Active: "active", // kích hoạt -> Đã xác Minh
  Unactive: "unactive", // chờ kích hoạt
  Locked: "locked", // vô hiệu hoá -> Huỷ
  WaitingUpdate: "update", // chờ cập nhật
};

module.exports = { UserRole, UserStatus };

export {};
