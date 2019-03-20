const nconf = require('nconf');
const path = require('path');

const message = () => {
  return nconf
    .argv()
    .env()
    .file({ file: path.join(__dirname, 'my-db.json') });
};

const product = () => {
  return nconf
    .argv()
    .env()
    .file({ file: path.join(__dirname, 'products.json') });
};

const skills = () => {
  return nconf
    .argv()
    .env()
    .file({ file: path.join(__dirname, 'skills.json') });
};

module.exports = {
  message,
  product,
  skills
};
