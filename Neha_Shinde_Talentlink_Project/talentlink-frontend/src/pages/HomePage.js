import React, { useEffect, useState } from 'react';
import NotificationBell from '../components/NotificationBell';


import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaFileContract,
  FaComments,
  FaSearch,
  FaStar,
  FaChartLine,
} from 'react-icons/fa';
import './HomePage.css';

const TESTIMONIALS = [
  { name: 'Anita R.', role: 'Product Manager', text: 'TalentLink helped me hire reliable freelancers fast. The proposal & contract flow is simple and secure.' },
  { name: 'Rahul K.', role: 'Frontend Freelancer', text: 'I landed multiple projects within a week. The dashboard & messaging keep everything organized.' },
  { name: 'Maya S.', role: 'Startup Founder', text: 'Great skill filters and reviews make selecting talent easy. Clean UI and fast communication.' },
];

function HomePage() {
  const [tIndex, setTIndex] = useState(0);

  // rotate testimonials
  useEffect(() => {
    const id = setInterval(() => setTIndex(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  // reveal on scroll (IntersectionObserver)
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
          else entry.target.classList.remove('active');
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(i => obs.observe(i));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="tl-home">
      {/* Navbar */}
      <nav className="tl-nav">
        <div className="container tl-nav-inner">
          <Link to="/" className="tl-brand">TalentLink</Link>
          <div className="tl-links">
            <Link to="/about" className="tl-link">About</Link>
            <Link to="/projects" className="tl-link">Projects</Link>
            <Link to="/how-it-works" className="tl-link">How it Works</Link>
            <NotificationBell /> {/* ✅ Add this line */}
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary ms-2">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="container hero-inner">
          <div className="hero-content reveal">
            <h1 className="hero-title">Connect top freelancers with great clients — securely.</h1>
            <p className="hero-sub">Post projects, receive proposals, convert to contracts, communicate in-app and build your reputation with reviews — all in one platform.</p>
            <div className="hero-ctas">
              <Link to="/register?role=freelancer" className="btn btn-ghost-lg">Join as Freelancer</Link>
              <Link to="/register?role=client" className="btn btn-outline-lg ms-3">Hire as Client</Link>
            </div>

            <div className="hero-trust mt-4">
              <div>Trusted by startups & teams — <strong>Secure contracts, role-based dashboards & real reviews</strong></div>
            </div>
          </div>

          <div className="hero-card reveal">
            <div className="tl-card-floating">
              <div className="card-row">
                <div className="card-item"><FaBriefcase /> <small>Projects</small></div>
                <div className="card-item"><FaComments /> <small>Messaging</small></div>
              </div>
              <div className="card-row">
                <div className="card-item"><FaFileContract /> <small>Contracts</small></div>
                <div className="card-item"><FaStar /> <small>Reviews</small></div>
              </div>
              <div className="card-bottom">
                <FaSearch/> <span>Smart search by skills & budget</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="features container py-5">
        <h2 className="section-title reveal">Platform Highlights</h2>
        <p className="section-sub reveal">Designed for Clients and Freelancers — built to support proposals → contracts → reviews lifecycle.</p>

        <div className="feature-grid">
          <div className="feature-card reveal">
            <div className="icon"><FaStar/></div>
            <h5>Role-Based Dashboards</h5>
            <p>Separate dashboards and permissions for Clients and Freelancers with actionable insights.</p>
          </div>

          <div className="feature-card reveal">
            <div className="icon"><FaBriefcase/></div>
            <h5>Project Posting</h5>
            <p>Post project briefs, required skills, budgets & timelines — public or invite-only.</p>
          </div>

          <div className="feature-card reveal">
            <div className="icon"><FaFileContract/></div>
            <h5>Proposals → Contracts</h5>
            <p>Accept proposals and create contracts that track status from Active → Completed.</p>
          </div>

          <div className="feature-card reveal">
            <div className="icon"><FaComments/></div>
            <h5>In-App Messaging</h5>
            <p>Secure conversations linked to projects & contracts (WebSocket-ready for real-time updates).</p>
          </div>

          <div className="feature-card reveal">
            <div className="icon"><FaSearch/></div>
            <h5>Skill-Based Search</h5>
            <p>Find the right talent quickly: filters for skill, budget, duration and rating.</p>
          </div>

          <div className="feature-card reveal">
            <div className="icon"><FaChartLine/></div>
            <h5>Analytics & Insights</h5>
            <p>Track proposals, conversions, active projects and ratings in visual dashboards.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how container py-5 reveal">
        <h3 className="section-title">How it works</h3>
        <div className="how-grid">
          <div className="how-step">
            <div className="step-num">1</div>
            <h5>Register</h5>
            <p>Create an account as a Client or Freelancer.</p>
          </div>
          <div className="how-step">
            <div className="step-num">2</div>
            <h5>Post / Find Projects</h5>
            <p>Clients post, freelancers browse & submit proposals.</p>
          </div>
          <div className="how-step">
            <div className="step-num">3</div>
            <h5>Accept & Contract</h5>
            <p>Accept proposals and convert them to tracked contracts.</p>
          </div>
          <div className="how-step">
            <div className="step-num">4</div>
            <h5>Deliver & Review</h5>
            <p>Complete work, rate peers and grow reputation.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials py-5">
        <div className="container reveal">
          <h3 className="section-title">What our users say</h3>
          <div className="testimonial-card">
            <p className="quote">“{TESTIMONIALS[tIndex].text}”</p>
            <div className="author">{TESTIMONIALS[tIndex].name} — <span>{TESTIMONIALS[tIndex].role}</span></div>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="tl-footer">
  {/* Animated Wave */}
  <div className="footer-wave">
    <svg viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="white"
        fillOpacity="1"
        d="M0,96L48,80C96,64,192,32,288,21.3C384,11,480,21,576,42.7C672,64,768,96,864,101.3C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32V0H0Z"
      ></path>
    </svg>
  </div>

  {/* Footer Content */}
  <div className="container footer-grid">
    {/* Column 1 - Brand */}
    <div className="footer-col">
      <h4 className="footer-brand">TalentLink</h4>
      <p className="footer-text">Connecting freelancers with clients through secure projects, proposals, and contracts.</p>
      <div className="social-links">
        <a href="#"><i className="fab fa-linkedin"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-github"></i></a>
      </div>
    </div>

    {/* Column 2 - Quick Links */}
    <div className="footer-col">
      <h5>Quick Links</h5>
      <ul>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/how-it-works">How It Works</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>

    {/* Column 3 - Resources */}
    <div className="footer-col">
      <h5>Resources</h5>
      <ul>
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/terms">Terms & Conditions</Link></li>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Blog</a></li>
      </ul>
    </div>

    {/* Column 4 - Newsletter */}
    <div className="footer-col">
      <h5>Stay Updated</h5>
      <p className="footer-text">Subscribe to get the latest updates on projects and features.</p>
      <form className="newsletter-form">
        <input type="email" placeholder="Your email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} TalentLink. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}

export default HomePage;
