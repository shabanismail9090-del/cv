import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Award, CheckCircle, LogIn, LogOut, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

const resumeData = {
  name: "Shaban Ismail",
  contact: {
    location: "Helwan, Egypt",
    phone: "01110003779",
    email: "Shabanismail2022@gmail.com",
    linkedin: "https://www.linkedin.com/in/ehabsabry840/"
  },
  summary: "I am a dedicated and results-driven Quality leader with extensive experience in implementing and managing quality management systems in the Concrete pipe sector to ensure the delivery of products and services that exceed customer expectations. Skilled in process improvement methodologies such as Lean Six Sigma and Total Quality Management (TQM), adept at analyzing data to drive decision-making and continuous improvement initiatives. Proven track record in quality assurance, quality control, and supplier management, with a keen focus on fostering a culture of quality excellence throughout the organization. Strong communicator and collaborator, committed to driving positive change and enhancing organizational performance through the pursuit of quality excellence.",
  experience: [
    {
      title: "Quality Manager",
      company: "Concrete Pipe Factory(Osman Group)",
      date: "May 2012 - Present",
      description: ""
    },
    {
      title: "Production Section Head",
      company: "Olympic group",
      date: "May 2008 - April 2012",
      description: ""
    },
    {
      title: "Health Safety Environmental Manager and Quality Assurance Leader & Quality Control Leader [ PPAP, Calibration and Metrology]",
      company: "Methode Egypt Electronics",
      date: "Mar 2022 - Jul 2023",
      description: "-Compliance with the laws and achieve all licenses required as X-ray & Env Registry & Governmental Compliance training\n-Establish an internal auditing section in Egypt, Pass more than 30 audits of certified bodies, Customer as (Renault, VW, Aston Martin, BMW)\n-Establish quality PPAP in Egypt\n-Establish calibration and Metrology section in Egypt"
    },
    {
      title: "Quality Assurance Leader & Quality Control Leader [ PPAP, Calibration and Metrology]",
      company: "Methode Egypt Electronics",
      date: "Sep 2019 - Mar 2022",
      description: ""
    },
    {
      title: "Quality Assurance Leader & Control Leader [ Calibration and Metrology]",
      company: "Methode Egypt Electronics",
      date: "May 2017 - Sep 2019",
      description: ""
    },
    {
      title: "Health Safety Environmental Manager and Quality Assurance leader & Quality Control Leader [ Calibration and Metrology]",
      company: "Methode Egypt Electronics",
      date: "Dec 2015 - May 2017",
      description: ""
    },
    {
      title: "Quality Control Leader [Injection & Paint line]",
      company: "Methode Egypt Electronics",
      date: "Sep 2015 - Dec 2015",
      description: "Upgrade the quality Paint Line section to start to monitor the cost of poor quality and ensure the target is met."
    },
    {
      title: "Quality Control Leader [Incoming goods]",
      company: "Methode Egypt Electronics",
      date: "Mar 2013 - Sep 2015",
      description: "Establish incoming & sorting and quarantine sections and upgrade the inspectors and checker to start the incoming process"
    },
    {
      title: "Quality Control Leader [Process]",
      company: "Methode Egypt Electronics",
      date: "Feb 2012 - Mar 2013",
      description: "Establish the new quality department in Egypt, Acquire TS-16964 for Egypt site, no customer complaints for one year."
    },
    {
      title: "Senior Quality Assurance Engineer",
      company: "Olympic Group",
      date: "May 2009 - Feb 2010",
      description: "Implement lean manufacturing project with the factory manager to raise productivity up to 50%"
    },
    {
      title: "Quality Control Engineer",
      company: "WHS Egypt",
      date: "Apr 2007 - May 2009",
      description: "Assisting in acquiring TS-16969, Create a statistical process control on the injection machine."
    }
  ],
  education: [
    {
      degree: "High School Diploma - Quality Management",
      institution: "National Quality Institute",
      date: "Jun 2006 - Sep 2007"
    },
    {
      degree: "High School Diploma - Quality Control",
      institution: "Ain Shams University",
      date: "Jun 2005 - Sep 2007"
    },
    {
      degree: "Bachelor of Applied Science (B.A.Sc.) - Mechanical Engineering",
      institution: "Zagazig",
      date: "Jun 2000 - Sep 2005"
    }
  ],
  softSkills: [
    "Project Management", "Ability to Develop Subordinates", "Interpersonal & Communication", 
    "Problem-Solving", "High Analytic Skills", "Utilize Resources", "organizing skills"
  ],
  technicalSkills: [
    "APQP", "VDA", "PPAP", "Statistical analysis", "MSA 1,2,3", "VDA 6.3", "MSA & SPC", 
    "FMEA", "8D", "Assembly", "Molding", "SAP knowledge"
  ],
  certifications: [
    { name: "CSR-02 -STELLANTIS harmonized APQP/PPAP Requirements (option 1)", issuer: "ABP management", year: "2023" },
    { name: "VDA 6.3", issuer: "ENCONA Academy [VDA QMC]", year: "2023" },
    { name: "VDA 6.3 CORE TOOL", issuer: "ENCONA Academy [VDA QMC]", year: "2023" },
    { name: "PSCR [Product Safety and Conformity Representative]", issuer: "ENCONA Academy [VDA QMC]", year: "2023" },
    { name: "Formula Q- compact (English)", issuer: "Volkswagen Bildungsinstitut GmbH", year: "2022" },
    { name: "Fire Alarm & Suppression Course", issuer: "Jelecom Egypt", year: "2022" },
    { name: "Fundamentals of Fall Protection", issuer: "Oregan OSHA", year: "2022" },
    { name: "Health and Safety Specialist", issuer: "NIOSH", year: "2020" },
    { name: "Environmental Laws", issuer: "Tabin Institute for Metallurgical Studies", year: "2020" },
    { name: "Lead Auditor ISO 45001:2018", issuer: "SGS", year: "2018" },
    { name: "Safety Committee", issuer: "NIOSH", year: "2018" },
    { name: "ISO 14001:2018 Lead auditor training", issuer: "TQCSI", year: "2018" },
    { name: "Mini MBA", issuer: "Brooklyn", year: "2017" },
    { name: "Internal Audit IATF 16949:2016", issuer: "SGS", year: "2017" },
    { name: "PMP attendance", issuer: "Leopard", year: "2014" },
    { name: "Trained in Malta", issuer: "Methode Malta", year: "2012" },
    { name: "TOT (Train for trainer)", issuer: "Olympic group", year: "2011" },
    { name: "PMP attendance", issuer: "Olympic", year: "2011" },
    { name: "TPM", issuer: "Symbios", year: "2008" },
    { name: "Injection Molding", issuer: "PTC", year: "2008" },
    { name: "Introduction in Properties Of Plastic", issuer: "PTC", year: "2008" },
    { name: "Six Sigma Green Belt", issuer: "", year: "2008" },
    { name: "Lean Green Belt Attendance", issuer: "Symbios", year: "2008" }
  ]
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check if user is admin based on email
      if (currentUser && currentUser.email === 'shabanismail9090@gmail.com' && currentUser.emailVerified) {
        setIsAdmin(true);
        fetchMessages();
      } else {
        setIsAdmin(false);
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        createdAt: serverTimestamp()
      });
      setSubmitStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error: any) {
      console.error("Error submitting message:", error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Hero Section */}
      <header className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{resumeData.name}</h1>
            <p className="text-xl text-slate-300 font-medium mb-6">Quality Manager & Leader</p>
            
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                <span>{resumeData.contact.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <span>{resumeData.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href={`mailto:${resumeData.contact.email}`} className="hover:text-white transition-colors">{resumeData.contact.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin size={16} className="text-blue-400" />
                <a href={resumeData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn Profile</a>
              </div>
            </div>
          </div>
          
          <div className="self-end md:self-start">
            {user ? (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                  <span>{user.displayName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition-colors font-medium"
              >
                <LogIn size={16} /> Admin Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Admin Panel (Only visible to admin) */}
        {isAdmin && (
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-blue-900">Admin Dashboard: Messages</h2>
            </div>
            
            {loadingMessages ? (
              <p className="text-blue-700">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-blue-700">No messages received yet.</p>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm relative group">
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                    <h3 className="font-bold text-slate-900">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-blue-600 hover:underline mb-2 block">{msg.email}</a>
                    <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs text-slate-400 mt-3">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Just now'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Summary */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Briefcase className="text-blue-600" /> Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            {resumeData.summary}
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Column: Experience & Education */}
          <div className="md:col-span-2 flex flex-col gap-12">
            {/* Experience */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Briefcase className="text-blue-600" /> Professional Experience
              </h2>
              <div className="flex flex-col gap-8">
                {resumeData.experience.map((job, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-slate-200">
                    <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-2"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <span className="text-sm font-medium text-blue-600 whitespace-nowrap bg-blue-50 px-2 py-1 rounded-md">{job.date}</span>
                    </div>
                    <h4 className="text-lg font-medium text-slate-600 mb-2">{job.company}</h4>
                    {job.description && (
                      <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                <GraduationCap className="text-blue-600" /> Education
              </h2>
              <div className="flex flex-col gap-6">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">{edu.degree}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-slate-600 font-medium">{edu.institution}</span>
                      <span className="text-sm text-slate-500">{edu.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Skills & Certifications */}
          <div className="flex flex-col gap-12">
            {/* Technical Skills */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                <CheckCircle className="text-blue-600" /> Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.technicalSkills.map((skill, index) => (
                  <span key={index} className="bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1.5 rounded-md border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Soft Skills */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                <CheckCircle className="text-blue-600" /> Soft Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.softSkills.map((skill, index) => (
                  <span key={index} className="bg-blue-50 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-md border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Award className="text-blue-600" /> Certifications
              </h2>
              <div className="flex flex-col gap-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-bold text-slate-900">{cert.name}</div>
                    <div className="flex justify-between text-slate-500 mt-1">
                      <span>{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Contact Form Section */}
        <section className="mt-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Get In Touch</h2>
          <p className="text-slate-500 text-center mb-8">Have a question or want to work together? Leave a message below.</p>
          
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input 
                type="text" 
                id="name"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Your Name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea 
                id="message"
                required
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                placeholder="How can I help you?"
              ></textarea>
            </div>

            {submitStatus === 'error' && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                {errorMessage}
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-100 flex items-center gap-2">
                <CheckCircle size={16} /> Message sent successfully!
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={submitStatus === 'submitting'}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitStatus === 'submitting' ? 'Sending...' : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </section>

      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Shaban Ismail. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
