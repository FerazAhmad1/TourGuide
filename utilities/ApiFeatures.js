class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((key) => delete queryObj[key]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const SortBy = this.queryString.sort.split(',').join(' ');
      console.log(SortBy, 'sortBy', '41');
      this.query = this.query.sort(SortBy);
    }
    return this;
  }

  limitingFields() {
    if (this.queryString.fields) {
      const limitBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(limitBy);
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
