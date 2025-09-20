import { Types } from 'mongoose';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import idConverter from '../../util/idConvirter';
import webuserServices from './webuser.service';

const createwebuser = catchAsync(async (req, res) => {
  const webuser = req.body;
  const result = await webuserServices.createwebuser(webuser);
  res.status(200).json({
    message: result.message || 'webuser created successfully',
    data: result,
  });
});

const getAllwebusers = catchAsync(async (req, res) => {
  const result = await webuserServices.getAllwebusers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All webusers',
    data: result,
  });
});

const getSinglewebuser = catchAsync(async (req, res) => {
  const webuser_id = req.query.webuser_id as string;
  const webuserIdConverted = idConverter(webuser_id);
  if (!webuserIdConverted) {
    throw new Error('webuser id conversion failed');
  }
  const result = await webuserServices.getSinglewebuser(webuserIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All webusers',
    data: result,
  });
});

const deleteSinglewebuser = catchAsync(async (req, res) => {
  const webuser_id = req.query.webuser_id as string;
  const webuserIdConverted = idConverter(webuser_id);
  if (!webuserIdConverted) {
    throw new Error('webuser id conversiopn failed');
  }
  const result = await webuserServices.deleteSinglewebuser(webuserIdConverted);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'webuser deleted',
    data: result,
  });
});

const webuserController = {
  createwebuser,
  getAllwebusers,
  getSinglewebuser,
  deleteSinglewebuser,
};

export default webuserController;
