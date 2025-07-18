const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getByDateRange,
  filterByCategory,
  getRecentTransactions,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

// All routes below are protected by authMiddleware
router.post("/add", authMiddleware, addTransaction);
router.get("/get", authMiddleware, getTransactions);
router.get("/get/:id", authMiddleware, getTransactionById);
router.put("/update/:id", authMiddleware, updateTransaction);
router.delete("/delete/:id", authMiddleware, deleteTransaction);
router.get("/summary", authMiddleware, getSummary);
router.get("/date-range", authMiddleware, getByDateRange);
router.get("/filter-category", authMiddleware, filterByCategory);
router.get("/recent", authMiddleware, getRecentTransactions);

module.exports = router;
