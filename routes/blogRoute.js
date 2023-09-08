const express = require("express");

const { createBlog, getAllBLog, getSingleBlog, updateBlog, deleteBlog } = require("../controllers/blogController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/blogs").get(getAllBLog);

router.route("/admin/blog/new").post(isAuthenticatedUser, authorizeRoles("admin"), createBlog);

router.route("/blog/:id").get(isAuthenticatedUser, getSingleBlog);

router.route("/admin/blog/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateBlog)
                               .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteBlog);

module.exports = router;
                         

