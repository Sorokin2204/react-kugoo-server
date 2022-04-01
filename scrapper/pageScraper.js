const Axios = require('axios');
const fs = require('fs');
const { default: slugify } = require('slugify');

async function scraperListProduct(url, browser) {
  let page = await browser.newPage();
  console.log(`Navigating to list products ${url}...`);
  await page.goto(url);
  await autoScroll(page);
  return await getProductUrls(page);
}

async function scraperSingleProduct(url, browser) {
  let page = await browser.newPage();
  console.log(`Navigating to single product ${url}...`);
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.waitForSelector('.t744');
  const title = await getTitle(page);
  const price = await getPrice(page);
  const isFind = findExistProduct(title, price);
  if (isFind) {
    console.log(`Find product ${title}`);

    return;
  }

  const slug = slugify(title, { lower: true });
  const sku = await getSku(page);
  const attributes = await getAttributes(page);
  const attributesSelect = await getAttributesSelect(page);
  const specifications = await getSpecifications(page);
  const imageSrc = await getImageSrc(page);

  const downloadImages = imageSrc.map((img, index) =>
    downloadImage(img, `${slug}(${index}).jpg`),
  );
  const images = await Promise.all(downloadImages);
  console.log(`Product "${title}" parsed...`);
  return {
    title,
    slug,
    sku,
    attributes,
    attributesSelect,
    specifications,
    images,
  };
}
async function getProductUrls(page) {
  let urls = await page.$$eval('.js-product > a', (rows) => {
    return rows.map((row) => {
      return row.getAttribute('href');
    });
  });
  return urls;
}

async function getTitle(page) {
  let title = await page.$$eval(
    '.t744__textwrapper .t744__title > div',
    (rows) => {
      return rows.map((row) => {
        let title = row.innerText.split('\n')[0];
        title = title.substr(title.indexOf(' ') + 1);
        return title;
      });
    },
  );
  return title[0];
}

async function getAttributes(page) {
  let attributes = await page.$$eval(
    '.t744__textwrapper .t-product__option-title.t-product__option-title_buttons.t-product__option-title_simple.t-descr.t-descr_xxs',
    (rows) => {
      return rows.map((row) => {
        return row.innerText;
      });
    },
  );
  return attributes;
}

async function getSku(page) {
  let sku = await page.$$eval('.t744__textwrapper .js-product-sku', (rows) => {
    return rows.map((row) => {
      return row.innerText;
    });
  });

  return sku[0];
}

async function getPrice(page) {
  let price = await page.$$eval('.t744__price-value', (rows) => {
    return rows.map((row) => {
      return row.innerText;
    });
  });

  return price[0];
}

async function getAttributesSelect(page) {
  let attributesSelect = await page.$$eval(
    '.t744__textwrapper  .js-product-option.t-product__option ',
    (rows) => {
      return rows.map((trows) => {
        let opts = [];
        const title = trows.querySelector(
          '.js-product-option-name.t-product__option-title.t-descr.t-descr_xxs',
        ).innerText;
        const opt = Array.from(
          trows.querySelectorAll(
            '.js-product-option-variants.t-product__option-select.t-descr.t-descr_xxs option',
          ),
          (column) => column.innerText,
        );
        opts.push(opt);

        return {
          name: title,
          options: opts,
        };
      });
    },
  );
  return attributesSelect;
}

async function getSpecifications(page) {
  let specifications = await page.$$eval(
    '.t812__pricelist-item__row_1.t-row ',
    (rows) => {
      return rows.map((trows) => {
        let opts = [];
        const title = trows.querySelector(
          '.t812__pricelist-item__title.t-name.t-name_sm',
        ).innerText;
        const value = trows.querySelector(
          '.t812__pricelist-item__price.t-name.t-name_sm',
        ).innerText;
        return {
          label: title,
          value: value,
        };
      });
    },
  );
  return specifications;
}

async function getImageSrc(page) {
  await page.waitForSelector('.t-slds__bgimg');
  let images = await page.evaluate(() => {
    const imgs = Array.from(
      document.querySelectorAll('.t-slds__item .t-slds__bgimg'),
      (imgg) => getComputedStyle(imgg).backgroundImage,
    );
    return imgs;
  });
  images = images.map((img) =>
    img
      .replace('static.', 'thumb.')
      .replace('-/resizeb/20x/', '-/format/webp/')
      .replace('url("', '')
      .replace('")', ''),
  );
  return images;
}

async function addProductInFile(newProduct) {
  var data = fs.readFileSync('productData.json');
  var allProduct = JSON.parse(data);
  allProduct.push(newProduct);
  var updateProducts = JSON.stringify(allProduct);
  fs.writeFile('productData.json', updateProducts, (err) => {
    if (err) throw err;
  });
}
function findExistProduct(productTitle, price) {
  var data = fs.readFileSync('productData.json');
  var allProduct = JSON.parse(data);
  const indexProduct = allProduct.find(
    (product) => product.title === productTitle,
  );

  if (!indexProduct) {
    return false;
  } else {
    return true;
  }
}

async function downloadImage(url, fileName) {
  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(`./images/products/${fileName}`))
      .on('error', reject)
      .once('close', () => resolve({ fileName, url }));
  });
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

module.exports = {
  scraperSingleProduct,
  addProductInFile,
  scraperListProduct,
  findExistProduct,
};
