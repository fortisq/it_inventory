const { getConfigurationValue } = require('../controllers/configurationController');

const getConfig = async (key, defaultValue = null) => {
  const value = await getConfigurationValue(key);
  return value !== null ? value : defaultValue;
};

module.exports = getConfig;
