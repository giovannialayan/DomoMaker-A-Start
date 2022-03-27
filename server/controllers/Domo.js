const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error has occurred' });
    }

    return res.render('app', { domos: docs });
  });
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'domo already exists' });
    }
    return res.status(400).json({ error: 'an error occurred' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
};
