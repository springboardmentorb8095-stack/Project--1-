import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const features = [
    {
      title: "Project Matchmaking",
      desc: "Clients post projects with budgets, timelines, and skills; freelancers find projects suited to their expertise.",
    },
    {
      title: "Smart Proposals & Contracts",
      desc: "Freelancers can submit proposals and get instant updates when a proposal is accepted or rejected.",
    },
    {
      title: "Real-time Messaging",
      desc: "Built-in chat system for instant and secure communication between client and freelancer.",
    },
    {
      title: "Ratings & Reviews",
      desc: "A transparent feedback system to help users build professional credibility.",
    },
  ];

  return (
    <>
      <style>{`
        .about-container {
          font-family: 'Poppins', sans-serif;
          color: #222;
          background-color: #f9fafb;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 4rem 8%;
          background: linear-gradient(120deg, #4f46e5, #9333ea);
          color: white;
        }

        .hero-text {
          flex: 1 1 400px;
          padding-right: 1rem;
        }

        .hero-text h1 {
          font-size: 3rem;
          font-weight: 800;
        }

        .hero-text p {
          margin-top: 1rem;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-primary {
          background: white;
          color: #4f46e5;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          transition: 0.3s;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: #e0e7ff;
        }

        .btn-outline {
          border: 2px solid white;
          background: transparent;
          color: white;
          padding: 0.7rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          transition: 0.3s;
          cursor: pointer;
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Hero Card */
        .hero-card {
          flex: 1 1 350px;
          background: white;
          color: #333;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }
        .hero-card:hover {
          transform: translateY(-4px);
        }
        .hero-card h3 {
          font-weight: 700;
          color: #4f46e5;
        }
        .project-details {
          margin: 1rem 0;
          font-size: 0.95rem;
          color: #555;
        }
        .button-row {
          display: flex;
          gap: 1rem;
        }

        /* Features Section */
        .features-section {
          text-align: center;
          padding: 5rem 8%;
        }
        .features-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111;
        }
        .section-subtext {
          color: #555;
          margin: 0.5rem auto 2rem;
          max-width: 600px;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.2);
        }
        .feature-card h3 {
          color: #4f46e5;
          margin-bottom: 0.5rem;
        }

        /* Stats Section */
        .stats-section {
          background: #fff;
          padding: 4rem 8%;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.2rem;
          margin-top: 2rem;
        }
        .stat-card {
          background: #f8fafc;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .stat-card h3 {
          color: #4f46e5;
          font-size: 1.5rem;
          font-weight: 700;
        }

        /* Footer */
        .footer-section {
          background: #4f46e5;
          color: white;
          text-align: center;
          padding: 3rem 8%;
        }
        .footer-buttons {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
          }
          .hero-text {
            padding-right: 0;
          }
          .hero-card {
            margin-top: 2rem;
          }
        }
      `}</style>

      <div className="about-container">
        {/* Hero Section */}
        <header className="hero-section">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-text"
          >
            <h1>TalentLink</h1>
            <p>
              A professional matchmaking platform that connects clients and
              freelancers with smart proposals, contracts, and real-time chat.
            </p>
            <div className="hero-buttons">
              <button className="btn-outline">Explore Features</button>
              <button className="btn-primary">Get Started</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-card"
          >
            <div className="card-header">
  <h3>Post a Project</h3>
  <button className="btn-link">Publish</button>
</div>

<div className="project-details">
  <p><strong>Budget:</strong> ₹50,000</p>
  <p><strong>Duration:</strong> 2 months</p>
  <p><strong>Skills:</strong> React, Django, ML</p>
</div>

<div className="button-row">
  <button className="btn-primary">Create Project</button>
  <button className="btn-outline">Save Draft</button>
</div>

          </motion.div>
        </header>

        {/* Features Section */}
        <section className="features-section" id="features">
          <h2>How TalentLink Works</h2>
          <p className="section-subtext">
            A role-based platform that connects clients and freelancers with
            clear workflows, chat, and review systems.
          </p>

          <div className="feature-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2>Platform at a Glance</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>1.2K+</h3>
              <p>Projects Posted</p>
            </div>
            <div className="stat-card">
              <h3>3.6K+</h3>
              <p>Active Freelancers</p>
            </div>
            <div className="stat-card">
              <h3>980+</h3>
              <p>Contracts Signed</p>
            </div>
            <div className="stat-card">
              <h3>4.8 / 5</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="footer-section">
          <div className="footer-content">
            <h3>Want to see TalentLink in action?</h3>
            <p>Request a demo or try our sandbox account today.</p>
            <div className="footer-buttons">
              <button className="btn-primary">Request Demo</button>
              <button className="btn-outline">Try Sandbox</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
