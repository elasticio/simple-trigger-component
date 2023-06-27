exports.validateISODate = (date) => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!isoDatePattern.test(date)) throw new Error(`Date ${date} must be in ISO format (1970-01-01T00:00:00.000Z)`);
};
