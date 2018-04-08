const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index', {
       name: req.name 
    });
};

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store'
    });
};

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    //query the database for a list of all stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores: stores });
}

exports.editStore = async (req, res) => {
    //find the store given the ID 
    const store = await Store.findOne({ _id: req.params.id });
    //confirm they are the owner of the store
    //TODO
    //render out the edit form so the user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store });
}

exports.updateStore = async (req, res) => {
    //set the location data to be a point
    req.body.location.type = 'Point';
    //find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //return the new store instead of the old one
        runValidators: true //run the validators again
    }).exec();

    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store </a>`);
    res.redirect(`/stores/${store._id}/edit`);

}