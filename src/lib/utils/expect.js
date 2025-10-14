const EXPECTED_PARAMETER_ERROR = key => `Expected parameter '${key}' not passed to function.`;

function has(options, key) {
  if (options[key] == null) {
    throw new Error(EXPECTED_PARAMETER_ERROR(key));
  }
}

function options(options, expectedKeys) {
  for (const key of expectedKeys) {
    has(options, key);
  }
}

function one(options, expectedKeys) {
  const found = expectedKeys.some(key => {
    try {
      has(options, key);
      return true;
    } catch (error) {
      if (!error.message.includes(EXPECTED_PARAMETER_ERROR(key))) {
        throw error;
      }
      return false;
    }
  });

  if (!found) {
    throw new Error(`Expected one of the following parameters, but found none: ${expectedKeys.join(', ')}`);
  }
}

module.exports = {
  has,
  options,
  one
};
