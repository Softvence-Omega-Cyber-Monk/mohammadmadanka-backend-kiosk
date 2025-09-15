import TemplateModel from "./template.model";
import { Template } from "./template.interface";

const create = async (data: Template) => {
  const template = await TemplateModel.create(data);
  console.log("sevice  ", data);
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

    // ✅ Match documents that contain *all* selected tags
    query.tags = { $all: tagsArray };
  }

  console.log("filters", filters);

  const templates = await TemplateModel.find(
    query,
    "id previewLink tags rudeContent isPersonalizable"
  );

  return templates;
};

const getTags = async (categoryId?: string) => {
  try {
    const filter: any = { isDeleted: false };

    if (categoryId) {
      filter.category = categoryId;
    }

    const tags = await TemplateModel.distinct("tags", filter);
    return tags;
  } catch (err) {
    console.error("Error fetching unique tags:", err);
    throw err;
  }
};

export const bulkUpdateTemplatesService = async (ids : string, amount: number) => {
  const result = await TemplateModel.updateMany(
    { _id: { $in: ids } },
    { price: amount } 
  );

  return result;
};

export const bulkUpdateTemplateTagsService = async (
  ids: string,
  action: string,
  tags: string[]
) => {
  let updateQuery;

  if (action === "add") {
    updateQuery = { $addToSet: { tags: { $each: tags } } }; // prevents duplicates
  } else if (action === "remove") {
    updateQuery = { $pull: { tags: { $in: tags } } };
  } else {
    throw new Error("Invalid action type");
  }

  const result = await TemplateModel.updateMany(
    { _id: { $in: ids } },
    updateQuery
  );

  return result;
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
  bulkUpdateTemplatesService,
  bulkUpdateTemplateTagsService,
};

export default templateService;
