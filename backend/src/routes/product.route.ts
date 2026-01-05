import { Router } from "express";
import { protect, requireEmailVerified, restrictTo } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router()

router.route("/")
    .get(getProducts)
    .post(protect, requireEmailVerified, restrictTo("admin"), upload.array("productImages",5), createProduct)

router.route("/:id")
    .get(getProduct)
    .patch(protect, requireEmailVerified, restrictTo("admin"), upload.array("productImages",5), updateProduct)
    .delete(protect, requireEmailVerified, restrictTo("admin"), deleteProduct)

export default router