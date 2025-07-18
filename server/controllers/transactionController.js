const Transaction = require("../models/Transaction");

// Add a transaction
exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user.id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all transactions for user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(txn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get summary (income, expense, balance)
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((txn) => {
      if (txn.type === "income") totalIncome += txn.amount;
      if (txn.type === "expense") totalExpense += txn.amount;
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get transactions within a date range
exports.getByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Filter transactions by category
exports.filterByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const transactions = await Transaction.find({
      userId: req.user.id,
      category: category,
    }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get last 5 transactions
exports.getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(5);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
