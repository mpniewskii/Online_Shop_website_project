const express = require("express");
const mongoose = require("mongoose");
const recordRoutes = express.Router();
const Product = require("../models/piwoModel");
const Cart = require("../models/koszykModel");
const Review = require("../models/recenzjaModel");
const Order = require("../models/zamowienieModel");

// Do cen pomiedzy wartosciami 
recordRoutes.route("/products/price-range").get(async function(req, res) {
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).send('Invalid price range');
    }

    try {
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } }, 'name imageUrl price deliveryOptions description quantityInStock');
        const productsWithDefaultDelivery = products.map(product => {
            const defaultDelivery = product.deliveryOptions.find(option => option.type === 'normalna');
            return {
                id: product._id,
                title: product.name,
                productImage: product.imageUrl,
                priceWithoutDelivery: product.price,
                priceWithDelivery: product.price + (defaultDelivery ? defaultDelivery.cost : 0),
                shortDescription: product.description,
                quantityInStock: product.quantityInStock
            };
        });
        res.json(productsWithDefaultDelivery);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Getuj produkty-lista_na_strone
recordRoutes.get('/products-summary', async (req, res) => {
    try {
        const products = await Product.find({}, 'name imageUrl price deliveryOptions description quantityInStock');
        const productsWithDefaultDelivery = products.map(product => {
            const defaultDelivery = product.deliveryOptions.find(option => option.type === 'normalna');
            return {
                id: product._id, // Dodaj to
                title: product.name,
                productImage: product.imageUrl,
                priceWithoutDelivery: product.price,
                priceWithDelivery: product.price + (defaultDelivery ? defaultDelivery.cost : 0),
                shortDescription: product.description,
                quantityInStock: product.quantityInStock
            };
        });
        res.json(productsWithDefaultDelivery);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Wyświetl produkty typu "kraft"
recordRoutes.get('/products/kraft', async (req, res) => {
    try {
      const products = await Product.find({ type: 'kraft' }, 'name imageUrl price deliveryOptions description quantityInStock');
      const productsWithDefaultDelivery = products.map(product => {
        const defaultDelivery = product.deliveryOptions.find(option => option.type === 'normalna');
        return {
          id: product._id, // Dodaj to
          title: product.name,
          productImage: product.imageUrl,
          priceWithoutDelivery: product.price,
          priceWithDelivery: product.price + (defaultDelivery ? defaultDelivery.cost : 0),
          shortDescription: product.description,
          quantityInStock: product.quantityInStock
        };
      });
      res.json(productsWithDefaultDelivery);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
// Wyświetl produkty typu "komercyjny"
recordRoutes.get('/products/komercyjny', async (req, res) => {
  try {
    const products = await Product.find({ type: 'komercyjny' }, 'name imageUrl price deliveryOptions description quantityInStock');
    const productsWithDefaultDelivery = products.map(product => {
      const defaultDelivery = product.deliveryOptions.find(option => option.type === 'normalna');
      return {
        id: product._id, // Dodaj to
        title: product.name,
        productImage: product.imageUrl,
        priceWithoutDelivery: product.price,
        priceWithDelivery: product.price + (defaultDelivery ? defaultDelivery.cost : 0),
        shortDescription: product.description,
        quantityInStock: product.quantityInStock
      };
    });
    res.json(productsWithDefaultDelivery);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Getuj po id
recordRoutes.route("/products/:id").get(async function(req, res) {
    try {
        const result = await Product.findById(req.params.id);
        res.json(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Dodaj browara
recordRoutes.route("/products/add").post(async function(req, res) {
    let product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        console.log('success')
        res.status(200).json({'product': 'product added successfully'});
    } catch(err) {
        res.status(400).send('adding new product failed');
    }
});

// Wyświetl rozszerzony opis produktu i typ
recordRoutes.get('/products/:productId/extendedDescription', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      res.send({ 
        extendedDescription: product.extendedDescription,
        type: product.type,
        deliveryOptions: product.deliveryOptions
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
// Wyświetl cenę produktu
recordRoutes.get('/products/:productId/price', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.send({ price: product.price });
  } catch (err) {
    res.status(500).send(err);
  }
});
  
// Wyświetl opcje dostawy produktu
recordRoutes.get('/products/:productId/deliveryOptions', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.send(product.deliveryOptions);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Wyświetl cenę produktu oraz ceny dostawy dla każdej opcji
recordRoutes.get('/products/:productId/pricesWithDelivery', async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      const pricesWithDelivery = product.deliveryOptions.map(option => ({
        deliveryType: option.type,
        totalCost: product.price + option.cost
      }));
      res.send(pricesWithDelivery);
    } catch (err) {
      res.status(500).send(err);
    }
  });

// Aktualizuj browara
recordRoutes.route("/products/update/:id").patch(async function(req, res) {
    try {
        let product = await Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
        if (!product) {
            res.status(404).send('data is not found');
        } else {
            res.json('Product updated!');
        }
    } catch(err) {
        console.log(err); // Log the error message to the console
        res.status(400).send("Update not possible: " + err.message); // Include the error message in the response
    }
});

// Usun browara
recordRoutes.route("/products/delete/:id").delete(async function(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json('Product deleted!');
    } catch(err) {
        res.status(500).send(err);
        console.log(err);
    }
});

// Dodaj do koszyka
recordRoutes.route("/cart/add").post(async function(req, res) {
    console.log('Product ID:', req.body.products[0].product); // Log the product ID

    let cart = await Cart.findOne({});
    if (!cart) {
        cart = new Cart({});
    }
    const product = await Product.findById(req.body.products[0].product);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    // Sprawdzenie ilosci zeby za duzo nie dac
    if (req.body.products[0].quantity > product.quantityInStock) {
        return res.status(400).send('Requested quantity exceeds available stock');
    }
    cart.products.push({ product: req.body.products[0].product, quantity: req.body.products[0].quantity, price: product.price });
    try {
        await cart.save();
        res.status(200).json({'cart': 'product added to cart successfully'});
    } catch(err) {
        res.status(400).send('adding product to cart failed');
    }
});


// Usun z koszyka
recordRoutes.route("/cart/remove").post(async function(req, res) {
    let cart = await Cart.findOne();
    if (!cart) {
        return res.status(404).send('cart not found');
    }
    cart.products = cart.products.filter(item => item.product.toString() !== req.body.products[0].product);
    try {
        await cart.save();
        res.status(200).json({'cart': 'product removed from cart successfully'});
    } catch(err) {
        res.status(400).send('removing product from cart failed');
    }
});

// Oblicz ostateczną cenę do zapłaty
recordRoutes.route("/cart/finalCost").post(async function(req, res) {
    let cart = await Cart.findOne({});
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    const deliveryMethod = req.body.deliveryMethod;
    const totalCost = await Cart.aggregate([
        { $unwind: "$products" },
        { $group: { _id: null, total: { $sum: { $multiply: [ "$products.price", "$products.quantity" ] } } } }
    ]);
    const deliveryCost = deliveryMethod === 'normalna' ? 15 : deliveryMethod === 'ekspresowa' ? 30 : 5;
    const finalCost = totalCost[0].total + deliveryCost;
    res.status(200).json({'totalCost': totalCost[0].total, 'finalCost': finalCost});
});

// Dodaj recenzje
recordRoutes.route("/reviews/add").post(async function(req, res) {
    let review = new Review(req.body);
    try {
        await review.save();
        res.status(200).json({'review': 'review added successfully'});
    } catch(err) {
        res.status(400).send('adding new review failed');
    }
});

recordRoutes.route("/reviews/delete/:id").delete(async function(req, res) {
    try {
        const result = await Review.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send('No review found with this id');
        }
        res.status(200).json({'review': 'review deleted successfully'});
    } catch(err) {
        res.status(400).send('deleting review failed: ' + err.message);
    }
});

// Wyswietl wszystkie recenzje dla produktu
recordRoutes.route("/reviews/:productId").get(async function(req, res) {
    try {
        const reviews = await Review.find({ product: req.params.productId });
        res.json(reviews);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Średnia ocena (dla gwiazdek)
recordRoutes.route("/reviews/average/:productId").get(async function(req, res) {
    try {
        const result = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(req.params.productId) } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);
        const averageRating = result.length > 0 ? result[0].averageRating : 0;
        res.json({ averageRating: averageRating || "No reviews" });
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Zdobyj cene calego zamowienia w koszyku
recordRoutes.route("/cart/total-price").get(async function(req, res) {
    try {
        let cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        let totalPrice = 0;
        for (let i = 0; i < cart.products.length; i++) {
            totalPrice += cart.products[i].price * cart.products[i].quantity;
        }
        totalPrice += cart.deliveryCost;
        res.json({ totalPrice: totalPrice });
    } catch(err) {
        res.status(500).send(err);
    }
});

// Produkt o najwyzszej ocenie
recordRoutes.route("/highest-rated").get(async function(req, res) {
    try {
        const result = await Review.aggregate([
            { $group: { _id: "$product", averageRating: { $avg: "$rating" } } },
            { $sort: { averageRating: -1 } }
        ]);
        const highestRatedProductId = result.length > 0 ? result[0]._id : null;
        if (highestRatedProductId) {
            const product = await Product.findById(highestRatedProductId);
            res.json(product);
        } else {
            res.json(null);
        }
    } catch(err) {
        res.status(500).send(err);
    }
});

// Produkt o najnizszej ocenie
recordRoutes.route("/lowest-rated").get(async function(req, res) {
    try {
        const result = await Review.aggregate([
            { $group: { _id: "$product", averageRating: { $avg: "$rating" } } },
            { $sort: { averageRating: 1 } }
        ]);
        const lowestRatedProductId = result.length > 0 ? result[0]._id : null;
        if (lowestRatedProductId) {
            const product = await Product.findById(lowestRatedProductId);
            res.json(product);
        } else {
            res.json(null);
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Cena od najnizszej
recordRoutes.route("/products/sort/price/asc").get(async function(req, res) {
    try {
        const result = await Product.aggregate([
            { $sort: { price: 1 } }
        ]);
        res.json(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Cena od najwyzszej
recordRoutes.route("/products/sort/price/desc").get(async function(req, res) {
    try {
        const result = await Product.aggregate([
            { $sort: { price: -1 } }
        ]);
        res.json(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// sortowansko po cenie i dostawie rosnaco
recordRoutes.route("/products/sort/price-delivery/:type/asc").get(async function(req, res) {
    try {
        const result = await Product.aggregate([
            { $unwind: "$deliveryOptions" },
            { $match: { "deliveryOptions.type": req.params.type } },
            { $addFields: { totalPrice: { $add: ["$price", "$deliveryOptions.cost"] } } },
            { $sort: { totalPrice: 1 } }
        ]);
        res.json(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Sortowansko po cenie i dostawie malejaco
recordRoutes.route("/products/sort/price-delivery/:type/desc").get(async function(req, res) {
    try {
        const result = await Product.aggregate([
            { $unwind: "$deliveryOptions" },
            { $match: { "deliveryOptions.type": req.params.type } },
            { $addFields: { totalPrice: { $add: ["$price", "$deliveryOptions.cost"] } } },
            { $sort: { totalPrice: -1 } }
        ]);
        res.json(result);
    } catch(err) {
        res.status(500).send(err);
    }
});
/*
// tworzenie zamowienia na podsawie koszyka
recordRoutes.route("/order/create").post(async function(req, res) {
    let cart = await Cart.findOne({});
    if (!cart) {
        return res.status(404).send('Cart not found');
    }
    let order = new Order({
        products: cart.products,
        confirmed: false
    });
    try {
        await order.save();
        res.status(200).json({'order': 'created successfully'});
    } catch(err) {
        res.status(400).send('creating order failed');
    }
});

// wybieramy metode dostawy
recordRoutes.route("/order/selectDeliveryMethod").post(async function(req, res) {
    let order = await Order.findById(req.body.orderId);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    const deliveryMethod = req.body.deliveryMethod;
    const deliveryCost = deliveryMethod === 'normalna' ? 15 : deliveryMethod === 'ekspresowa' ? 30 : 5;
    order.deliveryMethod = deliveryMethod;
    order.deliveryCost = deliveryCost;
    try {
        await order.save();
        res.status(200).json({'order': 'delivery method selected successfully'});
    } catch(err) {
        res.status(400).send('selecting delivery method failed');
    }
});

// wprowadzamy dane do dostawy
recordRoutes.route("/order/enterDeliveryDetails").post(async function(req, res) {
    let order = await Order.findById(req.body.orderId);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    order.deliveryDetails = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country
    };
    try {
        await order.save();
        res.status(200).json({'order': 'delivery details entered successfully'});
    } catch(err) {
        res.status(400).send('entering delivery details failed');
    }
});

// potwierdzamy zamowienie
recordRoutes.route("/order/confirm").post(async function(req, res) {
    let order = await Order.findById(req.body.orderId);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    order.confirmed = true;
    try {
        await order.save();
        res.status(200).json({'order': 'confirmed successfully'});
    } catch(err) {
        res.status(400).send('confirming order failed');
    }
});

// anuluj zamowienie
recordRoutes.route("/order/cancel").post(async function(req, res) {
    let order = await Order.findById(req.body.orderId);
    if (!order) {
        return res.status(404).send('Order not found');
    }
    order.confirmed = false;
    try {
        await order.save();
        res.status(200).json({'order': 'cancelled successfully'});
    } catch(err) {
        res.status(400).send('cancelling order failed');
    }
});
*/

recordRoutes.route("/order/create").post(async function(req, res) {
    let cart = await Cart.findOne({});
    if (!cart) {
        return res.status(404).send('Cart not found');
    }

    const deliveryMethod = req.body.deliveryMethod;
    const deliveryCost = deliveryMethod === 'normalna' ? 15 : deliveryMethod === 'ekspresowa' ? 30 : 5;

    let order = new Order({
        products: cart.products,
        deliveryDetails: {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            email: req.body.email
        },
        deliveryMethod: deliveryMethod,
        deliveryCost: deliveryCost,
        deliveryType: req.body.deliveryType,
        confirmed: false
    });

    try {
        await order.save();
        console.log('success')
        res.status(200).json({'order': 'created successfully'});
    } catch(err) {
        console.log(err);
        res.status(400).send('creating order failed');
    }
});

// Wyświetl wszystkie produkty, posortowane według oceny
recordRoutes.get('/products/rated', async (req, res) => {
    try {
      const products = await Product.find({}, 'name imageUrl price deliveryOptions description quantityInStock reviews');
      const productsWithDefaultDeliveryAndRating = products.map(product => {
        const defaultDelivery = product.deliveryOptions.find(option => option.type === 'normalna');
        const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;
        return {
          title: product.name,
          productImage: product.imageUrl,
          priceWithoutDelivery: product.price,
          priceWithDelivery: product.price + (defaultDelivery ? defaultDelivery.cost : 0),
          shortDescription: product.description,
          quantityInStock: product.quantityInStock,
          averageRating: averageRating
        };
      });
      // Sort products by average rating in descending order
      productsWithDefaultDeliveryAndRating.sort((a, b) => b.averageRating - a.averageRating);
      res.json(productsWithDefaultDeliveryAndRating);
    } catch (err) {
      res.status(500).send(err);
    }
});




module.exports = recordRoutes;