import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";    

dotenv.config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const ENDPOINT = process.env.MAILTRAP_API_ENDPOINT;

export const mailtrapClient = new MailtrapClient({
  endpoint: ENDPOINT,
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Homelander🍼",
};

















// const recipients = [
//   {
//     email: "kennethdcosta29@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);