import { useState } from "react";
import { FaUsers, FaHandshake, FaRocket, FaSearch, FaRegStar } from "react-icons/fa";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProjectList from "../pages/ProjectList";
import HeroImage from '../images/n.png';
import explore from '../images/explore.jpg';
import bgg2 from '../images/bgg2.png';


export default function PublicLayout() {
  const [panel, setPanel] = useState(null);
  const [showProjects, setShowProjects] = useState(false);
  const closePanel = () => setPanel(null);

  return (
    <div className="bg-grey-100 min-h-screen flex flex-col bg-gray-50 text-gray-800 overflow-hidden relative">
      {/* ===== NAVBAR ===== */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            onClick={() => setShowProjects(false)}
            className="text-3xl font-extrabold text-gradient cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"
          >
            TalentLink
          </div>
          <div className="space-x-3">
            <button
              onClick={() => setPanel("login")}
              className="px-4 py-2 rounded-md font-medium text-gray-700 hover:text-indigo-500 transition"
            >
              Login
            </button>
            <button
              onClick={() => setPanel("register")}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-600 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
        <main
  className={`flex-1 pt-16 transition-all duration-500 ease-in-out ${panel ? "md:pr-[400px]" : ""} relative`}
style={{
      backgroundImage: `url(${bgg2})`,
      backgroundAttachment: "fixed", // Keeps it fixed during scroll
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
>

        {!showProjects ? (
          <>
            {/* Hero Section */}
            <section className="relative w-full py-32 text-white text-center">
              {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }}></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-20"></div>

              {/* Content */}
              <div className="relative max-w-6xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                  Connect. Collaborate. Create.
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90">
                  TalentLink bridges the gap between top freelancers and visionary clients.
                </p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setPanel("register")} className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1" > Get Started </button>
                  <button onClick={() => setPanel("login")} className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition transform hover:-translate-y-1" > Login </button>
                </div>
              </div>
            </section>


            {/* Features Section */}
            <section className="py-24 bg-gray-50 w-full">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
                  Why Choose <span className="text-indigo-500">TalentLink?</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-10 ">
                  {[
                    {
                      icon: <FaUsers size={40} className="text-indigo-500 mb-4" />,
                      title: "Global Talent Pool",
                      desc: "Connect with skilled professionals worldwide and find your perfect match.",
                    },
                    {
                      icon: <FaHandshake size={40} className="text-indigo-500 mb-4" />,
                      title: "Trusted Collaboration",
                      desc: "Work securely using verified profiles, messaging, and transparent tracking.",
                    },
                    {
                      icon: <FaRocket size={40} className="text-indigo-500 mb-4" />,
                      title: "Boost Your Growth",
                      desc: "Grow your reputation and business through successful collaborations.",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
                    >
                      <div className="flex flex-col items-center">
                        {feature.icon}
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {/* Explore Projects Section */}
            <section className="py-20 w-full bg-gray-200">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                  
                  {/* Left clickable card */}
                  <div
                    onClick={() => setShowProjects(true)}
                    className="flex-1 cursor-pointer bg-indigo-500 text-white rounded-2xl p-12 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col justify-center items-center text-center"
                  >
                    <div className="absolute inset-0 bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${explore})` }}></div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Explore</h3>
                  </div>

                  {/* Right description/info card */}
                  <div className="flex-1 bg-white rounded-2xl p-12 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Explore Projects</h3>
                    <p className="text-gray-600">
                      Gain access to a curated list of freelance and client projects tailored to your expertise.
                      Collaborate securely, track your progress, and grow your professional network.
                    </p>
                  </div>

                </div>
              </div>
            </section>
            {/* How It Works */}
            <section className="py-24 bg-white w-full">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
                  How It <span className="text-indigo-500">Works</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-12 text-left">
                  {[
                    {
                      icon: <FaSearch size={32} className="text-indigo-500 mb-3" />,
                      title: "Explore Opportunities",
                      desc: "Browse projects or freelancers that fit your skills or needs.",
                    },
                    {
                      icon: <FaHandshake size={32} className="text-indigo-500 mb-3" />,
                      title: "Collaborate Securely",
                      desc: "Connect, negotiate, and manage contracts easily through TalentLink.",
                    },
                    {
                      icon: <FaRegStar size={32} className="text-indigo-500 mb-3" />,
                      title: "Achieve Success",
                      desc: "Deliver results, earn ratings, and build a strong professional profile.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-8 border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      <div className="flex flex-col items-start">
                        {item.icon}
                        <h3 className="text-xl md:text-2xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                
              </div>
            </section>


            


            {/* CTA */}
            <section className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white w-full py-24">
              <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">
                  Ready to Start Your Next Project?
                </h2>
                <p className="text-lg md:text-xl mb-8 text-indigo-100 max-w-2xl">
                  Whether you're a freelancer or a client seeking top-tier talent — TalentLink is your gateway to success.
                </p>
                <button
                  onClick={() => setPanel("register")}
                  className="bg-white text-indigo-600 font-semibold px-10 py-3 rounded-full shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1"
                >
                  Join TalentLink Today
                </button>
              </div>
            </section>
          </>
        ) : (
          
          <div className="max-w-6xl mx-auto px-6 py-12">
            <ProjectList setPanel={setPanel} />
          </div>
        )}
      </main>

      {/* ===== RIGHT PANEL ===== */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl w-full md:w-[400px] z-40 transform transition-transform duration-500 ${
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
      <footer className="bg-gray-700 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          <h3 className="text-lg font-semibold text-white mb-3">TalentLink</h3>
          <p className="max-w-xl mx-auto mb-4">
            The professional matchmaking platform connecting freelancers and clients for successful collaborations.
          </p>
          <div className="text-gray-500 text-sm border-t border-gray-700 pt-4">
            © {new Date().getFullYear()} TalentLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
