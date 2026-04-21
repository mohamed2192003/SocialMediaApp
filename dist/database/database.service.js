export const findOne = async ({ model, filter = {}, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findOne(filter, null, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const findAll = async ({ model, filter = {}, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.find(filter, null, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const findByIdAndDelete = async ({ model, id, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findByIdAndDelete(id, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const findByIdAndUpdate = async ({ model, id, data = {}, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findByIdAndUpdate(id, data, { new: true, ...queryOptions });
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const findById = async ({ model, id, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findById(id, null, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const insertOne = async ({ model, data, select = "", options = {}, }) => {
    const savedDoc = await model.create(data);
    let result = savedDoc;
    if (select.length) {
        result = await model.findById(savedDoc._id).select(select).exec();
    }
    if (options.populate && result) {
        await result.populate(options.populate);
    }
    return result;
};
export const findOneAndUpdate = async ({ model, filter = {}, data = {}, select = "", options = { new: true }, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findOneAndUpdate(filter, data, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
export const findOneAndDelete = async ({ model, filter = {}, select = "", options = {}, }) => {
    const { populate, ...queryOptions } = options;
    const query = model.findOneAndDelete(filter, queryOptions);
    if (select.length) {
        query.select(select);
    }
    if (populate) {
        query.populate(populate);
    }
    return query.exec();
};
