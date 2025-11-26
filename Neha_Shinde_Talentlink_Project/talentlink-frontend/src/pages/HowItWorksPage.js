import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  FileText,
  Send,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus size={36} color="#007BFF" />,
      title: "1. Create Your Account",
      desc: "Sign up as a client or freelancer using secure authentication. Customize your profile and get ready to collaborate.",
    },
    {
      icon: <FileText size={36} color="#007BFF" />,
      title: "2. Post or Discover Projects",
      desc: "Clients post project requirements while freelancers explore available jobs that match their skill set and interests.",
    },
    {
      icon: <Send size={36} color="#007BFF" />,
      title: "3. Send Proposals & Negotiate",
      desc: "Freelancers submit proposals. Clients review submissions, negotiate terms, and select the best fit.",
    },
    {
      icon: <MessageSquare size={36} color="#007BFF" />,
      title: "4. Collaborate & Communicate",
      desc: "Use built-in messaging and file sharing to discuss project details and ensure smooth communication.",
    },
    {
      icon: <CheckCircle size={36} color="#007BFF" />,
      title: "5. Deliver & Get Reviewed",
      desc: "Once work is completed, clients approve deliverables. Both parties leave reviews, boosting credibility and trust.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.header}
      >
        <h1 style={styles.title}>How TalentLink Works</h1>
        <p style={styles.subtitle}>
          A simple, secure, and transparent way to connect talent and
          opportunity.
        </p>
      </motion.div>

      {/* Steps Section */}
      <div style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={styles.card}
          >
            <div style={styles.iconWrapper}>{step.icon}</div>
            <h3 style={styles.cardTitle}>{step.title}</h3>
            <p style={styles.cardDesc}>{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.ctaSection}
      >
        <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={styles.ctaText}>
          Join TalentLink today and experience seamless collaboration —
          whether you're hiring or freelancing.
        </p>
        <div style={styles.buttonGroup}>
          <button style={{ ...styles.ctaButton, ...styles.clientBtn }}>
            Join as Client
          </button>
          <button style={{ ...styles.ctaButton, ...styles.freelancerBtn }}>
            Join as Freelancer
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2025 <strong>TalentLink</strong> | Infosys Springboard Internship
      </footer>
    </div>
  );
};

export default HowItWorks;

const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background:
      "radial-gradient(circle at top left, #E3F2FD, transparent 60%), radial-gradient(circle at bottom right, #BBDEFB, transparent 60%)",
    color: "#1a1a1a",
    minHeight: "100vh",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#007BFF",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#555",
    fontSize: "1.1rem",
  },
  stepsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "60px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    padding: "25px",
    width: "300px",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  iconWrapper: {
    marginBottom: "15px",
  },
  cardTitle: {
    color: "#004C99",
    fontSize: "1.1rem",
    marginBottom: "10px",
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: "0.95rem",
    color: "#555",
  },
  ctaSection: {
    background: "linear-gradient(90deg, #007BFF 0%, #00B4D8 100%)",
    borderRadius: "16px",
    padding: "50px 20px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
  ctaTitle: {
    fontSize: "1.8rem",
    marginBottom: "10px",
    fontWeight: "600",
  },
  ctaText: {
    fontSize: "1rem",
    marginBottom: "25px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  ctaButton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  clientBtn: {
    background: "#fff",
    color: "#007BFF",
  },
  freelancerBtn: {
    background: "#004C99",
    color: "#fff",
  },
  footer: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "0.9rem",
    color: "#666",
  },
};
