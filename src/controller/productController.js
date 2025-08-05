let productmodel = require("../model/productModel");

exports.addCategoryPage = (req, res) => {
    res.render("AddCategory.ejs");
};

exports.saveCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        const existing = await productmodel.checkCategory(categoryName);
        if (existing.length > 0) {
            return res.render("AddCategory.ejs", { msg: "Category already exists!" });
        }

    
        const result = await productmodel.saveCategory(categoryName, categoryDescription);
        return res.render("AddCategory.ejs", { msg: "Category saved successfully!" });

    } catch (err) {
        console.error("Error saving category:", err);
        return res.render("AddCategory.ejs", { msg: "Error saving category!" });
    }
};
exports.viewCategory = async (req, res) => {
    try {
        const categories = await productmodel.getAllCategories();
        res.render("ViewCategory.ejs", { categories });
    } catch (err) {
        res.render("ViewCategory.ejs");
    }
}

exports.searchProductByCategory = async (req, res) => {
    let categoryName = req.query.Cn;
    try {
        let categories = await productmodel.searchProductByCategory(categoryName);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.liveSearch = (req, res) => {
  const searchTerm = req.query.query;
  productmodel.searchProducts(searchTerm)
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    });
};

exports.deleteCategory =  (req, res) => {
    let categoryId =req.params.Did;

    let promise= productmodel.deleteCategory(categoryId);
    promise.then((result=>{
        let p= productmodel.getAllCategories();
        p.then((r)=>{
            res.render("ViewCategory.ejs", { categories: r, msg: "Category deleted successfully!" });
        })
        p.catch((err) => {
            res.render("ViewCategory.ejs", { categories:null,msg: "Error fetching categories!" });
        });
    })
    ).catch((err) => {
        res.render("ViewCategory.ejs", { categories:null, msg: "Error deleting category!" });
    });
    
}

exports.updateCategoryPage = async (req, res) => {
    let categoryId = req.params.Uid;
    let promise = productmodel.getCategoryById(categoryId);
    promise.then((result) => {
        if (result) {
            res.render("UpdateCategory.ejs", { category:result[0]});
        } else {
            res.render("UpdateCategory.ejs", );
        }
    });
};

exports.updateSaveCategory = async (req, res) => {
    let categoryId = req.body.category_id;
    let categoryName = req.body.categoryName;
    let categoryDescription = req.body.categoryDescription;
    let promise = productmodel.updateSaveCategory(categoryId, categoryName, categoryDescription);
    promise.then((result) => {
        if (result) {
            let p = productmodel.getAllCategories();
            p.then((r) => {
                res.render("ViewCategory.ejs", { categories: r, msg: "Category updated successfully!" });
            });
            p.catch((err) => {
                res.render("ViewCategory.ejs", { categories: null, msg: "Error fetching categories!" });
            });
        } else {
            res.render("ViewCategory.ejs", { categories:null,msg: "Error updating category!" });
        }
    }).catch((err) => {
        res.render("ViewCategory.ejs", { categories:null, msg: "Error updating category!" });
    });
    
}

exports.viewCategoryDetails = async (req, res) => {
    let category_id=req.params.Cid;
     let promise=productmodel.getCategoryById(category_id);
     promise.then((result) => {
            res.render("ViewCategoryDetails.ejs", { category: result[0] });
    });
};

exports.addSubCategoryPage = (req, res) => {
    let categoryId = req.params.Cid;
    res.render("AddSubCategory.ejs", {msg: null, categoryId });
}

exports.saveSubCategory = async (req, res) => {
    const { name, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;
    let promise = productmodel.addSubCategoryPage(name, image,categoryId);
    promise.then((result) => {
            res.render("AddSubCategory.ejs", { msg:"Subcategory added successfully!", categoryId });
    }).catch((err) => {
        res.render("AddSubCategory.ejs", { msg:"Error adding subcategory!", categoryId });
    })
}

exports.viewSubCategory = async (req, res) => {
    let categoryId = req.params.Cid;
    try {
        let categoryData = await productmodel.getCategoryById(categoryId);
        let categoryName = categoryData[0]?.category_name || "Unknown Category";

        let subcategories = await productmodel.getSubCategoriesByCategoryId(categoryId);
        res.render("ViewSubCategory.ejs", { 
            subcategories, 
            categoryId, 
            categoryName, 
            msg: null 
        });
    } catch (err) {
        res.render("ViewSubCategory.ejs", { 
            subcategories: null, 
            categoryId, 
            categoryName: "Unknown", 
            msg: "Error fetching subcategories!" 
        });
    }
};


exports.addProductPage = (req, res) => {
    let promise = productmodel.getAllSubCategories();
    promise.then((subcategories) => {
        res.render("AddProduct.ejs", { subcategories,msg: null });
    }).catch((err) => {
        res.render("AddProduct.ejs", { subcategories:[],msg: null });
    });
}

exports.saveProduct = async (req, res) => {
    const { name, subcategoryId, brand, description, stockUnit, stock, price, discount, organic, createdAt, updatedAt } = req.body;
    const image = req.file ? req.file.filename : null;


    const created_at = new Date().toISOString().slice(0, 10);
    const updated_at = new Date().toISOString().slice(0, 10);

    try {
        const result = await productmodel.saveProduct(
            name,
            image,
            subcategoryId,
            brand,
            description,
            stockUnit,
            stock,
            price,
            discount,
            organic,
            created_at,
            updated_at
        );

        const subcategories = await productmodel.getAllSubCategories();
        res.render("AddProduct.ejs", { subcategories, msg: result });

    } catch (err) {
        const subcategories = await productmodel.getAllSubCategories();
        res.render("AddProduct.ejs", { subcategories, msg: err });
    }
};


exports.viewProducts = async (req, res) => {
    try {
    const categories = await productmodel.getAllCategories();
    const subcategories = await productmodel.getAllSubCategories();
    
    res.render("ViewProducts.ejs", {
      categories,
      subcategories
    });
  } catch (err) {
    console.error(err);
    res.render("ViewProducts.ejs", {
      categories: [],
      subcategories: [],
      msg: "Something went wrong"
    });
  }
}

exports.viewProductsBySubcategory = async (req, res) => {
  const subcategoryId = req.params.subcategoryId;

  try {
    const products = await productmodel.getProductsBySubcategoryId(subcategoryId);
    res.render('SubcategoryProducts.ejs', { products });
  } catch (err) {
    res.status(500).send("Error fetching products.");
  }
};

exports.showProductDetails = async (req, res) => {
    const productId = req.params.product_id;

    try {
        const product = await productmodel.getProductById(productId);
        if (product) {
            res.render('ProductDetails.ejs', { product });
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product details.");
    }
};

exports.getProBySubCat = async (req, res) => {
    const subCatId = req.params.Sid;
    try {
        const products = await productmodel.getProductsBySubcategoryId(subCatId);
        if (products) {
            res.render('SubcategoryProducts.ejs', { products : products });
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product details.");
    }
};

exports.deleteSubCatByID =  (req, res) => {
    let subCatId =req.params.Sid;
    let categoryId = req.params.Cid;
    let promise= productmodel.deleteSubCatByID(subCatId);
    promise.then((result)=>{
        let p= productmodel.getSubCategoriesByCategoryId(categoryId);
        p.then((r)=>{
            res.render("ViewSubCategory.ejs", { subcategories : r, categoryId, msg: "Sub category deleted successfully!" });
        })
        p.catch((err) => {
             res.status(404).send("Sub category not found.");
        });
    }).catch((err) => {
        res.status(500).send("Error fetching sub category details.");
    });
    
}

exports.updateSubCategoryPage = async (req, res) => {
    console.log("Updating subcategory with ID:", req.params.Sid);
    let promise = productmodel.getSubCategoryById(req.params.Sid);

    promise.then((result) => {
        if (result && result.length > 0) {
            console.log("Subcategory found:", result[0]);
            res.render("UpdateSubCategory.ejs", { subcategory: result[0], msg: null }); // pass first object
        } else {
            res.status(404).send("Sub category not found.");
        }
    }).catch((err) => {
        res.status(404).send("Sub category not found.");
    });
}


exports.updateSubCategorySave = async (req, res) => {
    const subcategoryId = req.params.Sid;
    const { subcategory_name } = req.body;
    const image = req.file ? req.file.filename : null;
    console.log("Updating subcategory with ID:", subcategoryId);
    console.log("New subcategory name:", subcategory_name);
    try {
        const result = await productmodel.updatesavesubcategory(subcategoryId, subcategory_name, image);

        if (result && result.affectedRows > 0) {
            const updatedSubcategory = await productmodel.getSubCategoryById(subcategoryId);
            const categoryId = updatedSubcategory[0].category_id;

            const subcategories = await productmodel.getSubCategoriesByCategoryId(categoryId);
            res.render("ViewSubCategory.ejs", {
                subcategories,
                categoryId,
                msg: "Subcategory updated successfully!"
            });
        } else {
            const subcategory = await productmodel.getSubCategoryById(subcategoryId);
            res.render("UpdateSubCategory.ejs", {
                subcategory: subcategory[0],
                msg: "Error updating subcategory!"
            });
        }
    } catch (err) {
        console.error("Error updating subcategory:", err);
        const subcategory = await productmodel.getSubCategoryById(subcategoryId);
        res.render("UpdateSubCategory.ejs", {
            subcategory: subcategory[0] || {},
            msg: "Error updating subcategory!"
        });
    }
};

exports.viewSubCategoryDetails = async (req, res) => {
    let subcategory_id = req.params.Sid;
    let category_id=req.params.Cid;
    try {
        let subcategory = await productmodel.getSubCategoryById (subcategory_id);
        if (subcategory && subcategory.length > 0) {
            res.render("ViewSubCategoryDetails.ejs", { subcategories: subcategory[0],category_id});
        } else {
            res.status(404).send("Category not found.");
        }
    } catch (err) {
        console.error("Error fetching category details:", err);
        res.status(500).send("Error fetching category details.");
    }
}