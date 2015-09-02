var mongoose = require('mongoose'),
	Templates = mongoose.model('Template'),
	ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res, next) {
  var newTemplate = new Templates(req.body);
  newTemplate.save(function(err) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(newTemplate);
  });
};
exports.read = function (req, res, next) {
	var templateId = req.params.templateId;
	if(templateId){
		Templates.findById(ObjectId(templateId), function (err, template) {
		    if (err) {
		      return next(new Error('Failed to load Template'));
		    }
		    if (template) {
		      res.send(template);
		    } else {
		      res.send(404, 'PROYECT_NOT_FOUND')
		    }
		});
	} else {
		Templates.find(function (err, template) {
		    if (err) {
		      return next(new Error('Failed to load Template'));
		    }
		    if (template) {
		      res.send(template);
		    } else {
		      res.send(404, 'PROYECT_NOT_FOUND')
		    }
		});
	}
};
exports.update = function (req, res, next) {
	var templateId = req.params.templateId;
	Templates.findById(ObjectId(templateId), function (err, template) {
	    if (err) {
	      return next(new Error('Failed to load Template'));
	    }
	    if (template) {
	      res.send(template);
	    } else {
	      res.send(404, 'PROYECT_NOT_FOUND')
	    }
	});
};
exports.delete = function (req, res, next) {
	var templateId = req.params.templateId;
	Templates.remove({ _id: templateId }, function(err, movie) {
	    if (err) {
	      return res.send(err);
	    }
	    res.json({ message: 'Successfully deleted' });
	});
};
