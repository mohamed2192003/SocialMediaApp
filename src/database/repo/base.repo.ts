import { QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
import { HydratedDocument, Model, PopulateOptions } from "mongoose";
export class DatabaseRepository<TRowDocs> { //TRawDocs => customed interface 
    constructor(private model: Model<TRowDocs>) {
        this.model = model
    } // we are defining a constructor that takes a Mongoose model as a parameter and assigns it to a private property called model, this way we can use the model in the methods of the DatabaseRepository class to interact with the database, we are using the IUser interface to define the structure of the user documents in the database, this way we can ensure that the data that we are working with has the correct structure and types.
    create(data: Partial<TRowDocs>): Promise<HydratedDocument<TRowDocs>> { // we are defining a method called create that takes a data object as a parameter, this data object will be used to create a new document in the database, we are using the Partial utility type to make all the properties of the TRowDocs interface optional, this way we can pass only the properties that we want to use in the creation of the document, we are also defining the return type of the method as Promise<HydratedDocument<TRowDocs>> which is a promise that resolves to a hydrated document that has the structure defined by the TRowDocs interface, this way we can ensure that the data that is being returned from the create method has the correct structure and types.
        return this.model.create(data) // we are using the create method of the Mongoose model to create a new document in the database, we are passing the data object as a parameter to the create method, this way we can ensure that we are creating the correct document in the database, we are also defining the return type of the create method as Promise<HydratedDocument<TRowDocs>> which is a promise that resolves to a hydrated document that has the structure defined by the TRowDocs interface, this way we can ensure that the data that is being returned from the create method has the correct structure and types.
    }
    findOne(
        filter: Partial<TRowDocs>, // we are defining a method called findOne that takes a filter object as a parameter, this filter object will be used to find a single document in the database that matches the criteria defined in the filter, we are using the Partial utility type to make all the properties of the TRowDocs interface optional, this way we can pass only the properties that we want to use in the filter, we are also defining the return type of the method as Promise<HydratedDocument<TRowDocs>> which is a promise that resolves to a hydrated document that has the structure defined by the TRowDocs interface, this way we can ensure that the data that is being returned from the findOne method has the correct structure and types.
        select?: string | Record<string, 0 | 1>, // we are defining an optional parameter called select that can be either a string or an object, this parameter will be used to specify which fields of the document we want to include or exclude in the result, if the select parameter is a string, it should contain the names of the fields that we want to include in the result separated by spaces, for example "firstName lastName email", if the select parameter is an object, it should have the field names as keys and the values should be either 0 or 1, where 0 means that the field should be excluded from the result and 1 means that the field should be included in the result, for example { firstName: 1, lastName: 1, email: 0 } would include the firstName and lastName fields in the result and exclude the email field from the result.
        populate?: PopulateOptions | PopulateOptions[] // we are defining an optional parameter called populate that can be either a single PopulateOptions object or an array of PopulateOptions objects, this parameter will be used to specify which fields of the document we want to populate with data from other collections in the database, the PopulateOptions object has several properties that can be used to specify the details of the population, for example the path property is used to specify the name of the field that we want to populate, the model property is used to specify the name of the model that we want to use for the population, and the select property is used to specify which fields of the populated document we want to include or exclude in the result, for example { path: 'posts', model: 'Post', select: 'title content' } would populate the posts field of the document with data from the Post collection and include only the title and content fields in the result.
    ) {
        let docs = this.model.findOne(filter) // we are using the findOne method of the Mongoose model to find a single document in the database that matches the criteria defined in the filter, we are passing the filter object as a parameter to the findOne method, this way we can ensure that we are finding the correct document in the database, we are also defining the return type of the findOne method as Promise<HydratedDocument<TRowDocs>> which is a promise that resolves to a hydrated document that has the structure defined by the TRowDocs interface, this way we can ensure that the data that is being returned from the findOne method has the correct structure and types.
        if (select) {
            docs = docs.select(select) // we are using the select method of the Mongoose query to specify which fields of the document we want to include or exclude in the result, we are passing the select parameter as a parameter to the select method, this way we can ensure that we are including or excluding the correct fields in the result, we are also defining the select parameter as either a string or an object, this way we can use either format to specify which fields we want to include or exclude in the result.
        }
        if (populate) {
            docs = docs.populate(populate) // we are using the populate method of the Mongoose query to specify which fields of the document we want to populate with data from other collections in the database, we are passing the populate parameter as a parameter to the populate method, this way we can ensure that we are populating the correct fields in the result, we are also defining the populate parameter as either a single PopulateOptions object or an array of PopulateOptions objects, this way we can use either format to specify which fields we want to populate in the result.
        }
        return docs
    }
    findOneAndUpdate(
        filter: QueryFilter<TRowDocs>,
        update: UpdateQuery<TRowDocs>,
        options?: QueryOptions,
        select?: string | Record<string, 0 | 1>,
        populate?: PopulateOptions | PopulateOptions[]
    ) {
        let query = this.model.findByIdAndUpdate(filter, update, {
            new: true,
            ...options
        });
        if (select) {
            query = query.select(select)
        }
        if (populate) {
            query = query.populate(populate)
        }
        return query
    }
    findOneAndDelete(
        filter: QueryFilter<TRowDocs>,
        select?: string | Record<string, 0 | 1>,
        populate?: PopulateOptions | PopulateOptions[]
    ) {
        let query = this.model.findOneAndDelete(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
    findById(
        id: string,
        select?: string | Record<string, 0 | 1>,
        populate?: PopulateOptions | PopulateOptions[]
    ) {
        let query = this.model.findById(id);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        return query;
    }
}