const { Error } = require('mongoose');
const Tour = require('../../models/tourModel');
const APIFEATURES = require('../../utilities/ApiFeatures');

// let tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log('yes');
//   if (val > tours.length) {
//     console.log('yyyyyyyyyyyyyyyyyyyyyy');
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing Name or Price',
//     });
//   }
//   next();
// };

exports.getAllTour = async (req, res) => {
  try {
    const features = new APIFEATURES(Tour.find(), req.query)
      .filter()
      .sort()
      .limitingFields()
      .pagination();

    const tours = await features.query;
    console.log(req.query,'line 40 tourController');
    res.json({
      status: 'success',
       total:tours.length,
      data: {
        tours,
      },
    }); 
  } catch (err) {
    console.log(err);
    res.json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  res.json({
    status: 'success',

    data: {
      tour,
    },
  });
};

exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  console.log('inside of patch');
};

exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
  

exports.getStats = async(req,res)=>{
   try {
    console.log('i am getStats')
    const stats = await Tour.aggregate([
      {
        $match:{ratingsAverage:{$gte:4.5}},
      },
      {
        $group:{
          _id:"$difficulty",    // Always _id come first here null means all document
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'}

        },


      },

      {
        $sort:{avgPrice:1}
      }
    ])


    res.status(200).json({
      status: 'success',
      data: {
        stats
      },
    });

   } catch (error) {
    console.log(error)
   }
}