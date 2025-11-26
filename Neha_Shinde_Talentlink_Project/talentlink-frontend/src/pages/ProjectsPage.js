import React from "react";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const projects = [
    {
      title: "AI Chatbot Development",
      desc: "Create a custom AI chatbot for customer support using NLP and machine learning.",
      budget: "₹70,000",
      duration: "1.5 months",
      skills: ["Python", "TensorFlow", "React"],
    },
    {
      title: "E-Commerce Website Revamp",
      desc: "Redesign an existing online store with better UI/UX and payment gateway integration.",
      budget: "₹90,000",
      duration: "2 months",
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      title: "Healthcare Appointment App",
      desc: "Develop a mobile-friendly appointment booking system with real-time doctor availability.",
      budget: "₹1,20,000",
      duration: "3 months",
      skills: ["Flutter", "Firebase", "Django"],
    },
    {
      title: "Portfolio Website Builder",
      desc: "A no-code tool for freelancers to build and host personal portfolio websites.",
      budget: "₹45,000",
      duration: "1 month",
      skills: ["Next.js", "Tailwind", "Supabase"],
    },
  ];

  return (
    <>
      <style>{`
        .projects-container {
          font-family: 'Poppins', sans-serif;
          background-color: #f9fafb;
          color: #222;
          padding: 4rem 8%;
        }

        .projects-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .projects-header h1 {
          font-size: 2.5rem;
          color: #4f46e5;
          font-weight: 800;
        }

        .projects-header p {
          color: #555;
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
        }

        .project-card {
          background: white;
          border-radius: 16px;
          padding: 1.8rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.07);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(79,70,229,0.2);
        }

        .project-card h3 {
          color: #4f46e5;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .project-card p {
          color: #444;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .project-meta {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 1rem;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .skill-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 0.3rem 0.8rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .card-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .btn-outline {
          border: 2px solid #4f46e5;
          background: transparent;
          color: #4f46e5;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn-outline:hover {
          background: #eef2ff;
        }

        /* Footer */
        .project-footer {
          text-align: center;
          margin-top: 4rem;
          color: #555;
        }

        .project-footer button {
          margin-top: 1.2rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .projects-header h1 {
            font-size: 2rem;
          }
          .project-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="projects-container">
        <div className="projects-header">
          <h1>Explore Live Projects</h1>
          <p>Discover real projects clients are posting — find your next opportunity!</p>
        </div>

        <div className="project-grid">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="project-card"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3>{project.title}</h3>
              <p>{project.desc}</p>

              <div className="project-meta">
                <p><strong>Budget:</strong> {project.budget}</p>
                <p><strong>Duration:</strong> {project.duration}</p>
              </div>

              <div className="skills">
                {project.skills.map((s, j) => (
                  <span key={j} className="skill-tag">{s}</span>
                ))}
              </div>

              <div className="card-buttons">
                <button className="btn-primary">View Details</button>
                <button className="btn-outline">Apply</button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="project-footer">
          <p>Want to explore more? Browse all active projects on TalentLink.</p>
          <button className="btn-primary">View All Projects</button>
        </div>
      </div>
    </>
  );
}
