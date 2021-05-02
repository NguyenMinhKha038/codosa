import nodemailer from "nodemailer";
import order from "../order/order.model";
import staff from "../staffs/staff.model";

const adminEmail = 'thepain381998@gmail.com'
const adminPassword = 'Tieuholy3819988'
// Host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587;

const send =async (to, subject, content) => {
    // Khởi tạo một transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
    const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: adminEmail,
            pass: adminPassword
        }
    })
    const options = {
        from: adminEmail, // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: `Order mới vừa được tạo bởi ${content.email}, ${JSON.stringify(content.arrProduct)}. Total:${content.total}. Địa chỉ: ${content.address}` // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }
    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    await transporter.sendMail(options)
};

export default {send}

