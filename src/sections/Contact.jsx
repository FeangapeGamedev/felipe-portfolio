import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css"; // ✅ Make sure this file exists

const Contact = ({ onClose }) => {
    console.log("Contact component mounted!"); // ✅ Debug log
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = ({ target: { name, value } }) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        emailjs
            .send(
                import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
                {
                    from_name: form.name,
                    to_name: "Felipe A. Garcia",
                    from_email: form.email,
                    to_email: "your-email@example.com", // ✅ Replace with your email
                    message: form.message,
                },
                import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setLoading(false);
                    alert("Thank you for your message! 😊");
                    setForm({ name: "", email: "", message: "" });
                },
                (error) => {
                    setLoading(false);
                    console.error(error);
                    alert("Oops! Something went wrong. 😢");
                }
            );
    };

    return (
        <div className="contact-container">
            <div className="contact-header">
                Contact Me
                <button onClick={onClose} className="close-button">✖</button>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="contact-name">Full Name</label>
                <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                />

                <label htmlFor="contact-email">Email</label>
                <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                />

                <label htmlFor="contact-message">Your Message</label>
                <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Say something..."
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
};

export default Contact;
