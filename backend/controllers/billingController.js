
const Billing = require("../models/Billing");

// ADD INVOICE
const addBilling = async (req, res) => {
  try {
    const {
      invoiceNumber,
      reservation,
      amount,
      paymentMethod,
      paymentStatus
    } = req.body;

    const existingInvoice = await Billing.findOne({ invoiceNumber });

    if (existingInvoice) {
      return res.status(400).json({
        message: "Invoice number already exists"
      });
    }

    const billing = await Billing.create({
      invoiceNumber,
      reservation,
      amount,
      paymentMethod,
      paymentStatus
    });

    res.status(201).json({
      message: "Invoice added successfully",
      billing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL INVOICES
const getBillings = async (req, res) => {
  try {
    const billings = await Billing.find().populate("reservation");

    res.status(200).json({
      count: billings.length,
      billings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE INVOICE
const getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate("reservation");

    if (!billing) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.status(200).json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE INVOICE
const updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!billing) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.status(200).json({
      message: "Invoice updated successfully",
      billing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE INVOICE
const deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.status(200).json({
      message: "Invoice deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addBilling,
  getBillings,
  getBillingById,
  updateBilling,
  deleteBilling
};
