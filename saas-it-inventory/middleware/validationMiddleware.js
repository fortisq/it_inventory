const Joi = require('joi');

const validateInventoryItem = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    quantity: Joi.number().integer().min(0).required(),
    // Add more fields as needed
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateInventoryItem,
};
