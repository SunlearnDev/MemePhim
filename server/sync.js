const sequelize = require("./src/configs/configs.mysql");
const {
  User,
  UserDevices,
  UserDeviceAssignments
} = require("./src/models/index");
const syncDatabase = async () => {
  try {
    // force: true xóa tất cả dữ liệu trong bảng đã tồn tại trước khi đồng bộ dữ liệu
    // alter: true cập nhật lại lại bảng mà không mất dữ liệu
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

syncDatabase();
//dùng node server/sync.js để chạy file này
