const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db');

const indexGet = (req, res, next) => {
  res.render('pages/index', {
    products: db.product().stores.file.store.products,
    skills: db.skills().stores.file.store.skills
  });
};

const indexPost = (req, res) => {
  const time = new Date().toUTCString().replace(/:/g, '.');
  const dataBase = db.message();

  dataBase.set(time, req.body);
  dataBase.save();

  res.render('pages/index', {
    products: db.product().stores.file.store.products,
    skills: db.skills().stores.file.store.skills,
    msgsemail: 'Данные успешно отправлены'
  });
};

const loginGet = (req, res) => res.render('pages/login');

const loginPost = (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@test.ru' && password === 'admin') {
    req.session.auth = true;
    res.render('pages/admin');
  } else {
    res.render('pages/login', {
      msgslogin: 'Не верные почта или пароль'
    });
  }
};

const adminGet = (req, res) => {
  if (req.session.auth) { res.render('pages/admin'); } else { res.render('pages/login'); }
};

const skillsPost = (req, res) => {
  if (!req.session.auth) { res.render('pages/login'); }
  const dataBase = db.skills();
  const { age, concerts, cities, years } = req.body;
  const skills = [
    {
      'number': age,
      'text': 'Возраст начала занятий на скрипке'
    },
    {
      'number': concerts,
      'text': 'Концертов отыграл'
    },
    {
      'number': cities,
      'text': 'Максимальное число городов в туре'
    },
    {
      'number': years,
      'text': 'Лет на сцене в качестве скрипача'
    }
  ];

  dataBase.set('skills', skills);
  dataBase.save();

  res.render('pages/admin', {
    msgskill: 'Данные успешно отправлены'
  });
};

const uploadPost = (req, res, next) => {
  if (!req.session.auth) { res.render('pages/login'); }

  var form = new formidable.IncomingForm();

  let upload = path.join('./public', '/assets/img/products');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    const dataBase = db.product();
    const { name, price } = fields;

    if (err) {
      return next(err);
    }

    const valid = validation(fields, files);

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(`/?msg=${valid.status}`);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      let dir = fileName.substr(fileName.indexOf('\\'));
      const products = db.product().stores.file.store.products;

      products.push({
        src: dir,
        name,
        price
      });

      dataBase.set('products', products);
      dataBase.save();

      res.render('pages/admin', {
        msgfile: 'Данные успешно отправлены'
      });
    });
  });
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!fields.name) {
    return { status: 'Не указано описание картинки!', err: true };
  }
  return { status: 'Ok', err: false };
};

module.exports = {
  indexGet,
  indexPost,
  loginGet,
  loginPost,
  adminGet,
  skillsPost,
  uploadPost
};
