let express = require("express");
let router = express.Router();
let userCtrl = require("../controller/userController");
let productCtrl = require("../controller/productController");
let upload = require("../middlware/PhotoUpload.js");
const { getUserFromToken } = require("../middlware/checkHomeToken.js");

router.get("/", getUserFromToken, userCtrl.homePage);
router.get("/login", userCtrl.LoginPage);
router.get("/register", userCtrl.RegisterPage);
router.post("/registerdata", upload.single("photo"), userCtrl.SaveUserData);
router.post("/logindata", userCtrl.LoginUserData);
router.get("/userProfile", getUserFromToken, userCtrl.userProfile);
router.get("/adminDashboard", getUserFromToken, userCtrl.adminDashboard);
router.get("/logout", userCtrl.logoutUser);
router.get("/profile",getUserFromToken,userCtrl.ShowUserProfile);



router.get("/add-category", productCtrl.addCategoryPage);
router.post("/savecategory", productCtrl.saveCategory);
router.get("/view-category", productCtrl.viewCategory);
router.get("/searchProductByCategory", productCtrl.searchProductByCategory);
router.get("/deleteCategory/:Did", productCtrl.deleteCategory);
router.get("/updateCategory/:Uid", productCtrl.updateCategoryPage);
router.post("/updateSaveCategory", productCtrl.updateSaveCategory);
router.get("/viewCategoryDetails/:Cid", productCtrl.viewCategoryDetails);


router.get("/add-subcategory/:Cid", productCtrl.addSubCategoryPage);
router.post("/subcategorysave",upload.single("image"), productCtrl.saveSubCategory);
router.get("/view-subcategories/:Cid", productCtrl.viewSubCategory);
router.get("/viewProBySubCat/:sid",productCtrl.getProBySubCat);
router.get("/deleteSubCat/:sid",productCtrl.deleteSubCatByID);



router.get("/add-product", productCtrl.addProductPage);
router.post("/productsave", upload.single("image"), productCtrl.saveProduct);
router.get("/view-products", productCtrl.viewProducts);
router.get('/products/:subcategoryId', productCtrl.viewProductsBySubcategory);
router.get('/product/:product_id', productCtrl.showProductDetails);

module.exports = router;
