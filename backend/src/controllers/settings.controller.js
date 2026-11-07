const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { settingsService } = require("../services");

const getSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.getSettings();
  res.status(httpStatus.OK).json(
    response({
      message: "Settings Retrieved Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: settings,
    })
  );
});

const updateSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Settings Updated Successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: settings,
    })
  );
});

module.exports = {
  getSettings,
  updateSettings,
};

