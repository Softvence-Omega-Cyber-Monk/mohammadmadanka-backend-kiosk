import TemplateModel from "./template.model";
import { Template } from "./template.interface";

const create = async (data: Template) => {
  const template = await TemplateModel.create(data);
  return template;
};

const getAll = async () => {
  const templates = await TemplateModel.find({ isDeleted: false })
    .populate("category", "name")
    .populate("occasion", "name");
  return templates;
};

const getById = async (id: string) => {
  const template = await TemplateModel.findOne({
    _id: id,
    isDeleted: false,
  }).populate("category");
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
  tags?: string[];
}) => {
  const query: any = { isDeleted: false };

  if (filters.category) query.category = filters.category;
  if (filters.occasion) query.occasion = filters.occasion;
  if (filters.tags && filters.tags.length > 0) {
 
    const tagsArray = filters.tags
      .map((tag) => tag.split(",")) 
      .flat() 
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    query.tags = { $in: tagsArray };
  }

  console.log("filters", filters);

  const templates = await TemplateModel.find(
    query,
    "id previewLink tags rudeContent"
  );


  return templates;
};

const getTags = async () => {
  try {
    // Use MongoDB's distinct to get unique tags values
    const tags = await TemplateModel.distinct("tags", { isDeleted: false });

    return tags;
  } catch (err) {
    console.error("Error fetching unique target users:", err);
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
  getTags,
};

export default templateService;
