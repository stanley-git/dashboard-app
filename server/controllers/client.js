import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async(req, res) => {
    try {
        const products = await Product.find();
        // console.log("reached here");
        // console.log(products);
        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({productId: product._id});
                // console.log(product);
                return {
                    ...product._doc,
                    // ...product,
                    stat,
                }
                // return product;
            })
        );
        res.status(200).json(productsWithStats);
        // res.status(200).json("OK");

    } catch(error) {
        res.status(404).json(error);
    }
}

export const getCustomers = async(req, res) => {
    try {
        // console.log("reached here");
        const customers = await User.find({role: "user"}).select("-password");

        res.status(200).json(customers);

    } catch(error) {
        res.status(404).json(error);
    }
}

export const getTransactions = async(req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        const generateSort = () => {
            
            console.log('sort:', sort);
            const sortParsed = JSON.parse(sort);
            console.log('sortParsed:', sortParsed);
            const sortFormatted = {
                [sortParsed.field]: sortParsed.sort = "asc" ? 1 : -1
            }
            console.log('sortFormatted:', sortFormatted);
            return sortFormatted;
        }
        const sortFormatted = Boolean(sort) ? generateSort() : {};

        const transactions = await Transaction.find({
            $or: [
                {cost: {$regex: new RegExp(search, "i")}},
                {userId: {$regex: new RegExp(search, "i")}},
                ]
        })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize);

        const total = await Transaction.countDocuments({
            name: {$regex: search, $options: "i"}
        })

        res.status(200).json({
            transactions,
            total
        });

    } catch(error) {
        res.status(404).json(error);
    }
}

export const getGeography = async(req, res) => {
    try {

        const users = await User.find();

        const mappedLocations = users.reduce((acc, { country }) => {
            const countryISO3 = getCountryIso3(country);
            if(!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});
        // console.log(Object.entries(mappedLocations));
        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return {id: country, value: count};
            })
        res.status(200).json(formattedLocations);

    } catch(error) {
        res.status(404).json(error);
    }
}