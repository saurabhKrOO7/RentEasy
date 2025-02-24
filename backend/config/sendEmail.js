import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Product from "../models/Product.js"; // Import your Product model
import generatePDFinvoice from "./generatePDFinvoice.js";

dotenv.config();

export const sendReceiptEmail = async (req, res) => {
  try {
    const { userInfo, order } = req.body;

    if (!userInfo?.email || !order?.order) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    // Extract product IDs from order items
    const productIds = order.order.items.map((item) => item.product_id);

    // Fetch product details from the database
    const products = await Product.find({ _id: { $in: productIds } });

    // Map product IDs to names
    const productNameMap = {};
    products.forEach((product) => {
      productNameMap[product._id] = product.name;
    });

    // Get formatted item details
    const itemDetails = order.order.items
      .map((item) => {
        return `<p><strong>🛍️ Item:</strong> ${
          productNameMap[item.product_id] || "Unknown Item"
        } 
      (Qty: ${item.quantity}) - ₹${item.price}</p>`;
      })
      .join("");

    // Ensure order items exist to prevent crashes
    const firstItem = order.order.items?.[0] || {};

    // Ensure rental records exist
    const firstRental = order.rentalRecords?.[0] || {};

    // Email data
    const emailData = {
      email: userInfo.email,
      orderId: order.order.order_id || "N/A",
      itemName: firstItem.name || "Unknown Item",
      duration: firstRental.rentalEndDate
        ? Math.round(
            (new Date(firstRental.rentalEndDate) -
              new Date(firstRental.rentalStartDate)) /
              (1000 * 60 * 60 * 24)
          )
        : "N/A",
      totalPrice: order.order.total_amount || "N/A",
      orderStatus: order.order.order_status || "Pending",
      paymentMethod: order.order.paymentMethod || "N/A",
      createdAt: order.order.createdAt || new Date().toISOString(),
      rentalStartDate: firstRental.rentalStartDate
        ? new Date(firstRental.rentalStartDate).toLocaleDateString()
        : "N/A",
      rentalEndDate: firstRental.rentalEndDate
        ? new Date(firstRental.rentalEndDate).toLocaleDateString()
        : "N/A",
    };

    // Generate PDF Invoice
    const invoicePath = await generatePDFinvoice(order, userInfo, products);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: true },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userInfo.email,
      subject: "🎉 Your Order Receipt - RentEase",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center;">🛒 Order Confirmation</h2>
          <p style="font-size: 16px;">Thank you for your order! Below are your order details:</p>
    
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
            <p><strong>🆔 Order ID:</strong> ${emailData.orderId}</p>
            ${itemDetails}
            <p><strong>💰 Total Cost:</strong> ₹${emailData.totalPrice}</p>
            <p><strong>🛒 Order Status:</strong> ${emailData.orderStatus}</p>
            <p><strong>💳 Payment Method:</strong> ${
              emailData.paymentMethod
            }</p>
            <p><strong>📅 Order Date:</strong> ${new Date(
              order.order.createdAt
            ).toLocaleString()}</p>
          </div>
    

            <h3 style="color: #2c3e50; margin-top: 20px;">📌 Rental Details</h3>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
            <p><strong>📅 Start Date:</strong> ${emailData.rentalStartDate}</p>
            <p><strong>📅 End Date:</strong> ${emailData.rentalEndDate}</p>
          </div>

          <hr/>
          <p style="text-align: center;">If you have any questions, contact us at <a href="mailto:support@rentease.com">support@rentease.com</a>.</p>
          <p style="text-align: center;">Thank you for choosing <strong>RentEase</strong>! 🚀</p>
        </div>
      `,
      attachments: [
        { filename: `invoice-${order.order.order_id}.pdf`, path: invoicePath },
      ],
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Receipt sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send receipt",
      error: error.message,
    });
  }
};
