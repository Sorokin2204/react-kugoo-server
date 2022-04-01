const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const pretty = require('pretty');
var xpath = require('xpath');
const browserObject = require('../scrapper/browser');
const scraperController = require('../scrapper/pageController');
dom = require('xmldom').DOMParser;
const scrappingProduct = () => {
  let rawData = fs.readFileSync('singleProductHtml.json');
  let pageData = JSON.parse(rawData);

  const $ = cheerio.load(pageData.html);
  let productData = {};
  productData.title = getTitle($);
  productData.vendorCode = getVendorCode($);
};

const getTitle = ($) => {
  let title = $('h1 span').html();
  const indexOfSpace = title.indexOf(' ');
  title = title.substring(indexOfSpace + 1);
  title = title.replace('<br>', '');
  return title;
};
const getVendorCode = ($) => {
  let vendorCode = $('.js-store-price-wrapper').html();
  return vendorCode;
};

module.exports = { scrappingProduct };
