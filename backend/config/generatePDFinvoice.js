import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoice = (order, userInfo, products) => {
  return new Promise((resolve, reject) => {
    const invoiceDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(
      invoiceDir,
      `invoice-${order.order.order_id}.pdf`
    );
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // **Company Branding**
    const companyName = "RentEase Pvt Ltd";
    const companyEmail = "support@rentease.com";
    const companyPhone = "+91 8986397619";
    const companyAddress = "123, Rental Street, Patna, Bihar, India";
    const logoPath = path.join(__dirname, "../../frontend/images/logo.png"); // Update with actual logo path

    // **Header**
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 50, { width: 100 });
    }
    doc.fontSize(20).fillColor("#333").text(companyName, 160, 60);
    doc.fontSize(10).fillColor("#777").text(companyAddress, 160, 80);
    doc.text(`Phone: ${companyPhone}`, 160, 95);
    doc.text(`Email: ${companyEmail}`, 160, 110);
    doc.moveDown(2);

    // **Invoice Title**
    doc.fontSize(22).fillColor("#2c3e50").text("INVOICE", { align: "center" });
    doc.moveDown();

    // **Customer & Order Details**
    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Order ID: ${order.order.order_id}`);
    doc.text(`Customer: ${userInfo.name}`);
    doc.text(`Email: ${userInfo.email}`);
    doc.text(`Payment Method: ${order.order.paymentMethod}`);
    doc.text(`Total Amount: ₹${order.order.total_amount}`);
    doc.moveDown();

    // **Items Table Header**
    doc
      .fontSize(14)
      .fillColor("#2c3e50")
      .text("Ordered Items", { underline: true });
    doc.moveDown(0.5);

    // **Table Structure**
    const tableTop = doc.y;
    const colX = [50, 250, 350, 450, 520]; // Column Positions

    doc.fontSize(12).fillColor("#333").text("Item", colX[0], tableTop);
    doc.text("Description", colX[1], tableTop);
    doc.text("Qty", colX[2], tableTop);
    doc.text("Price", colX[3], tableTop);
    doc.text("Total", colX[4], tableTop);
    doc.moveDown(0.3);
    doc.strokeColor("#aaa").moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Table Header Line

    // **Item Rows**
    let totalAmount = 0;
    products.forEach((item, index) => {
      const rowY = tableTop + 20 + index * 25;
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      totalAmount += itemTotal;

      doc.fontSize(10).fillColor("#000");
      doc.text(item.name, colX[0], rowY);
      doc.text(item.description || "N/A", colX[1], rowY, { width: 90 });
      doc.text(item.quantity || "1", colX[2], rowY);
      doc.text(`₹${item.price || 0}`, colX[3], rowY);
      doc.text(`₹${itemTotal}`, colX[4], rowY);
    });

    doc.moveDown();
    doc.strokeColor("#aaa").moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Table Footer Line

    // **Total Amount**
    doc
      .fontSize(14)
      .fillColor("#2c3e50")
      .text(`Grand Total: ₹${totalAmount}`, 400, doc.y + 10, {
        align: "right",
      });

    // **Footer Note**
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#777")
      .text(
        "Thank you for choosing RentEase! For any issues, please contact our support.",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

export default generateInvoice;
