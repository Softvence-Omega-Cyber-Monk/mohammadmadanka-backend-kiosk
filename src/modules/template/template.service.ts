import TemplateModel from "./template.model";
import { Template } from "./template.interface";

const create = async (data: Template) => {
  const template = await TemplateModel.create(data);
  return template;
};

const getAll = async () => {
  const templates = await TemplateModel.find({ isDeleted: false });
  return templates;
};

const getById = async (id: string) => {
  const template = await TemplateModel.findOne({ _id: id, isDeleted: false });
  return template;
};

const update = async (id: string, data: Partial<Template>) => {
  const template = await TemplateModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    { new: true }
  );
  return template;
};

const softDelete = async (id: string) => {
  const result = await TemplateModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

const getByCreatedBy = async (createdBy: string) => {
  const templates = await TemplateModel.find({
    createdBy,
    isDeleted: false,
  });
  return templates;
};

const filterTemplates = async (filters: {
  category?: string;
  occasion?: string;
}) => {
  const query: any = { isDeleted: false };

  if (filters.category) query.category = filters.category;
  if (filters.occasion) query.occasion = filters.occasion;

  const templates = await TemplateModel.find(query, 'id previewLink targetUser rudeContent');
  return templates;
};


const getTargetUser = async () => {
  try {
    // Use MongoDB's distinct to get unique targetUser values
    const targetUsers = await TemplateModel.distinct('targetUser', { isDeleted: false });
    return targetUsers;
  } catch (err) {
    console.error('Error fetching unique target users:', err);
    throw err;
  }
};


const templateService = {
  create,
  getAll,
  getById,
  update,
  softDelete,
  getByCreatedBy,
  filterTemplates,
  getTargetUser,
};

export default templateService;
