import TemplateModel from "./template.model";
import { Template } from "./template.interface";

const create = async (data: Template) => {
  try {
    const template = await TemplateModel.create(data);
    console.log("service  ", data);
    return template;
  } catch (err) {
    console.error("Error creating template:", err);
    throw new Error("Error creating template");
  }
};

const getAll = async () => {
  try {
    const templates = await TemplateModel.find({ isDeleted: false })
      .populate("category", "name")
      .populate("occasion", "name");
    return templates;
  } catch (err) {
    console.error("Error fetching templates:", err);
    throw new Error("Error fetching templates");
  }
};

const getById = async (id: string) => {
  try {
    const template = await TemplateModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate("category");
    if (!template) {
      throw new Error("Template not found");
    }
    return template;
  } catch (err) {
    console.error(`Error fetching template with id ${id}:`, err);
    throw new Error(`Error fetching template with id ${id}`);
  }
};

const update = async (id: string, data: Partial<Template>) => {
  try {
    const template = await TemplateModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
    if (!template) {
      throw new Error("Template not found for update");
    }
    return template;
  } catch (err) {
    console.error(`Error updating template with id ${id}:`, err);
    throw new Error(`Error updating template with id ${id}`);
  }
};

const softDelete = async (id: string) => {
  try {
    const result = await TemplateModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!result) {
      throw new Error("Template not found for deletion");
    }
    return result;
  } catch (err) {
    console.error(`Error soft deleting template with id ${id}:`, err);
    throw new Error(`Error soft deleting template with id ${id}`);
  }
};

const getByCreatedBy = async (createdBy: string) => {
  try {
    const templates = await TemplateModel.find({
      createdBy,
      isDeleted: false,
    });
    return templates;
  } catch (err) {
    console.error(`Error fetching templates created by ${createdBy}:`, err);
    throw new Error(`Error fetching templates created by ${createdBy}`);
  }
};

const filterTemplates = async (filters: {
  category?: string;
  occasion?: string;
  tags?: string[];
}) => {
  try {
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
      "id previewLink tags rudeContent isPersonalizable occasion"
    ).populate("occasion");

    return templates;
  } catch (err) {
    console.error("Error filtering templates:", err);
    throw new Error("Error filtering templates");
  }
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
    throw new Error("Error fetching unique tags");
  }
};

export const bulkUpdateTemplatesService = async (ids: string[], amount: number) => {
  try {
    const result = await TemplateModel.updateMany(
      { _id: { $in: ids } },
      { price: amount }
    );
    return result;
  } catch (err) {
    console.error("Error bulk updating templates:", err);
    throw new Error("Error bulk updating templates");
  }
};

export const bulkUpdateTemplateTagsService = async (
  ids: string[],
  action: string,
  tags: string[]
) => {
  try {
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
  } catch (err) {
    console.error("Error bulk updating template tags:", err);
    throw new Error("Error bulk updating template tags");
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
  bulkUpdateTemplatesService,
  bulkUpdateTemplateTagsService,
};

export default templateService;
