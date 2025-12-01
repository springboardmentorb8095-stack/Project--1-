// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import PortfolioForm from "./pages/PortfolioForm";

import ProjectDetails from "./pages/ProjectDetails"; //Optional — you now use ProposalForm
import ProposalForm from "./pages/ProposalForm";

import ProjectForm from "./pages/ProjectForm";
import ProjectList from "./pages/ProjectList";

import ProposalView from "./pages/ProposalView";

// inside your <Routes> component

import PublicProfile from "./pages/PublicProfile";
import Contracts from "./pages/Contracts";
import ChatThread from "./pages/ChatThread";
import MessageInbox from "./pages/MessageInbox";
import NotificationsDropdown from "./pages/NotificationsDropdown";

import ContractDetail from "./pages/ContractDetail"; // Adjust path as needed

import ReviewList from "./pages/ReviewList";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/profile" element={<Profile />} />

        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/add" element={<PortfolioForm />} />

        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects/edit/:id" element={<ProjectForm isEdit={true} />} />

        <Route path="/proposals/new/:id" element={<ProposalForm />} />
        <Route path="/proposals/edit/:proposalId" element={<ProposalForm />} />
        <Route path="/proposals/view/:id" element={<ProposalView />} />

        <Route path="/users/:id/profile" element={<PublicProfile />} />

        <Route path="/contracts" element={<Contracts />} />
        <Route path="/contracts/:id" element={<ContractDetail />} />

        <Route path="/messages" element={<MessageInbox />} />
        <Route path="/messages/:userId" element={<ChatThread />} />

        <Route path="/noti" element={<NotificationsDropdown />} />

        <Route path="/reviews" element={<ReviewList />} />

      </Routes>
    </Router>
  );
}

export default App;




















import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaHandshake, FaRocket, FaSearch, FaRegStar } from "react-icons/fa";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function PublicLayout() {
  const [panel, setPanel] = useState(null); // "login" | "register" | null

  const closePanel = () => setPanel(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 overflow-hidden relative">
      {/* ===== NAVBAR ===== */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600 tracking-tight cursor-pointer">
            Talent<span className="text-indigo-500">Link</span>
          </div>

          {/* Auth Buttons */}
          <div className="space-x-3">
            <button
              onClick={() => setPanel("login")}
              className="px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </button>
            <button
              onClick={() => setPanel("register")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main
        className={`flex-1 pt-24 transition-all duration-500 ease-in-out ${
          panel ? "md:pr-[400px]" : ""
        }`}
      >
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full py-24 px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connect. Collaborate. Create.
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-blue-100">
              TalentLink bridges the gap between top freelancers and visionary clients.  
              Find talent or opportunities and bring your ideas to life.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPanel("register")}
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-blue-50 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => setPanel("login")}
                className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50 w-full">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              Why Choose <span className="text-blue-600">TalentLink?</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaUsers size={36} className="text-blue-600 mb-4" />,
                  title: "Global Talent Pool",
                  desc: "Connect with skilled professionals worldwide and find your perfect match."
                },
                {
                  icon: <FaHandshake size={36} className="text-blue-600 mb-4" />,
                  title: "Trusted Collaboration",
                  desc: "Work securely using verified profiles, messaging, and transparent tracking."
                },
                {
                  icon: <FaRocket size={36} className="text-blue-600 mb-4" />,
                  title: "Boost Your Growth",
                  desc: "Grow your reputation and business through successful collaborations."
                }
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex flex-col items-center">
                    {f.icon}
                    <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                    <p className="text-gray-600">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white w-full">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12 text-gray-800">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-10 text-left">
              {[
                {
                  icon: <FaSearch size={30} className="text-blue-600 mb-3" />,
                  title: "Explore Opportunities",
                  desc: "Browse projects or freelancers that fit your skills or needs."
                },
                {
                  icon: <FaHandshake size={30} className="text-blue-600 mb-3" />,
                  title: "Collaborate Securely",
                  desc: "Connect, negotiate, and manage contracts easily through TalentLink."
                },
                {
                  icon: <FaRegStar size={30} className="text-blue-600 mb-3" />,
                  title: "Achieve Success",
                  desc: "Deliver results, earn ratings, and build a strong professional profile."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex flex-col items-start">
                    {item.icon}
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-full py-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl">
              Whether you're a freelancer looking for your next gig or a client seeking top-tier talent — TalentLink is your gateway to success.
            </p>
            <button
              onClick={() => setPanel("register")}
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-md shadow hover:bg-blue-50 transition"
            >
              Join TalentLink Today
            </button>
          </div>
        </section>
      </main>

      {/* ===== RIGHT PANEL ===== */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-xl w-full md:w-[400px] z-30 transform transition-transform duration-500 ${
          panel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700 capitalize">{panel}</h2>
          <button onClick={closePanel} className="text-gray-500 hover:text-gray-800 text-xl">
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {panel === "login" && <Login onSuccess={closePanel} />}
          {panel === "register" && <Register onSuccess={closePanel} />}
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-auto z-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          <h3 className="text-lg font-semibold text-white mb-3">TalentLink</h3>
          <p className="max-w-xl mx-auto mb-4">
            The professional matchmaking platform connecting freelancers and
            clients for successful collaborations.
          </p>
          <div className="text-gray-500 text-sm border-t border-gray-700 pt-4">
            © {new Date().getFullYear()} TalentLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
