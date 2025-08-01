let db=require("../../db.js")

exports.saveCategory = (name, description) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO categories (category_name, category_description) VALUES (?, ?)", [name, description], (err, result) => {
            if (err) {
                reject("Error adding category"); 
            }else {
                
                resolve("Category added successfully");
            }
        });
    });
};

exports.checkCategory = (name) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM categories WHERE category_name = ?", [name], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM categories", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.searchProductByCategory = (categoryName) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM categories WHERE category_name LIKE ?", [`%${categoryName}%`], (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("Search result:", result);
                resolve(result);
            }
        });
    });
}

exports.deleteCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM categories WHERE id = ?", [categoryId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getCategoryById = (categoryId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM categories WHERE id = ?", [categoryId], (err, result) => {
            if (err) {
                reject(err);
            } 
            else{
                resolve(result);
            }
        });
    });
}

exports.updateSaveCategory = (categoryId, categoryName, categoryDescription) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE categories SET category_name = ?, category_description = ? WHERE id = ?", [categoryName, categoryDescription, categoryId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.addSubCategoryPage = (name,categoryid,image) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO subcategory VALUES ('0',?, ?, ?)", [name,categoryid,image], (err, result) => {
            if (err) {

                reject("Error adding subcategory");
            } else {
                resolve("Subcategory added successfully");
            }
        });
    });

}

exports.getSubCategoriesByCategoryId = (categoryId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM subcategory WHERE category_id = ?", [categoryId], (err, result) => {
            if (err) {
                reject(err);
            } else {
               resolve(result);
            }
        });
    });
}

exports.getAllSubCategories = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM subcategory", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

exports.saveProduct = (name, image, subcategoryId, brand, description, stockUnit, stock, price, discount, organic, created_at, updated_at) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO products VALUES ('0',?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, image, subcategoryId, brand, description, stockUnit, stock, price, discount, organic, created_at, updated_at], (err, result) => {
            if (err) {
                reject("Error saving product");
            } else {
                
                resolve("Product saved successfully");
            }
        });
    });
};
exports.getProductsBySubcategoryId = (subcategoryId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM products WHERE subcategory_id = ?", [subcategoryId], (err, results) => {
            if (err) return reject(err);
            else 
            {
<<<<<<< HEAD
                console.log("Products by subcategory:", results);
=======
>>>>>>> 040a3c664c0da631258fc7b055aad9abece527e5
                resolve(results);
            }
                
        });
    });
};

exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM products WHERE product_id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
<<<<<<< HEAD
=======
};
exports.deleteSubCatByID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM subcategory WHERE subcategory_id = ?';
    db.query(sql, [id], (err, result) => {
      if (err)
      {
         console.log(err);
         reject(err);
      }
      else{
         
         resolve(result[0]);
      }
    });
  });
>>>>>>> 040a3c664c0da631258fc7b055aad9abece527e5
};