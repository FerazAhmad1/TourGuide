const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please give tour name'],
    unique: true,
    trim: true,
  },
  slug: String,
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    required: [true, 'please tell the duration of tour'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'please tell the maximum group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'please specify difficulty level'],
  },
  price: {
    type: Number,
    required: [true, 'please provide price for the tour'],
  },

  priceDiscount: {
    type: Number,
    validate: function (val) {
      return val < this.price;
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summery'],
  },

  discription: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'A tour must have cover Image'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

// DOCUMENT MIDDLEWARE:runs before save() and create()
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(Date.now() - this.start);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
