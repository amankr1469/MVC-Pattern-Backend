const {
    createPincode,
    getAllPincodes,
    createAndUpdateHeader,
    getHeaderLine,
    createCoupon,
    getAllCoupons,
    sendContactInformation,
    deletePincode,
    updatePincode,
    deleteCoupon,
} = require("../controllers/utilsController");
  
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = require("express").Router();
  
//Pincode routes----------------------------------------------------------------
router.route("/util/pincode/create").post(isAuthenticatedUser, authorizeRoles("admin"), createPincode);

router.route("/util/pincodes").get(isAuthenticatedUser, authorizeRoles("admin"),getAllPincodes);

//Get Single Pincode not required!

router.route("util/pincode/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updatePincode)
                                  .delete(isAuthenticatedUser, authorizeRoles("admin"),deletePincode);

//Header routes----------------------------------------------------------------
router.route("/util/header").post(isAuthenticatedUser, authorizeRoles("admin"), createAndUpdateHeader);

router.route("/util/header").get(isAuthenticatedUser, authorizeRoles("admin"), getHeaderLine);


//Coupon routes----------------------------------------------------------------
router.route("/util/coupon/create").post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);

router.route("/util/coupons").get(isAuthenticatedUser, authorizeRoles("admin"), getAllCoupons);

router.route("/util/coupon/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);



// router.route("/util/sendMessage").post(sendContactInformation);
  
module.exports = router;
  