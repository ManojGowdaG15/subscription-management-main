import { Link, useNavigate } from 'react-router-dom';
import { FiPlay, FiZap, FiShield, FiGlobe, FiTv, FiSmile, FiArrowRight, FiCheckCircle, FiCpu, FiActivity, FiArrowUpRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Cinematic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-red-600/10 blur-[180px] animate-pulse-glow rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-600/5 blur-[180px] animate-pulse-glow rounded-full" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-purple-600/5 blur-[180px] animate-pulse-glow rounded-full" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
          <div className="inline-flex items-center space-x-3 px-6 py-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-[10px] font-black tracking-[5px] uppercase text-red-500 italic">SYSTEM STATUS: ELITE-NODE ONLINE</span>
          </div>

          <h1 className="text-[13vw] lg:text-[11vw] font-extrabold italic tracking-tighter text-white leading-[0.8] uppercase select-none animate-fade-in">
            CINEMATIC <br />
            <span className="text-red-600 red-glow">REDEFINED</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-400 font-light leading-relaxed uppercase tracking-[4px] animate-fade-in delay-300">
            Access the pinnacle of membership architecture. Engineered for those who demand <span className="text-white font-black underline decoration-red-600/50 underline-offset-8 decoration-2">absolute cinematic excellence</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 pt-8 animate-fade-in delay-500">
            <Link to={isAuthenticated ? "/browse" : "/plans"} className="btn-premium py-7 px-16 group min-w-[280px]">
              <span className="relative z-10 flex items-center justify-center space-x-4">
                <span className="text-xs font-black tracking-[5px]">INITIALIZE ACCESS</span>
                <FiZap className="group-hover:rotate-12 transition-transform text-lg" />
              </span>
            </Link>
            <Link to="/browse" className="btn-secondary py-7 px-16 group min-w-[280px]">
              <span className="flex items-center justify-center space-x-4">
                <span className="text-xs font-black tracking-[5px]">EXPLORE LIBRARY</span>
                <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-lg" />
              </span>
            </Link>
          </div>
        </div>

        {/* Floating Device Frame Mockup */}
        <div className="mt-40 max-w-7xl mx-auto relative group animate-fade-in delay-700">
          <div className="absolute inset-0 bg-red-600/10 blur-[120px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
          <div className="glass-card p-4 border-white/10 shadow-[0_100px_160px_-40px_rgba(0,0,0,0.8)] transform group-hover:-translate-y-4 transition-all duration-700">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[21/9]">
              <img
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1920&q=80"
                alt="Interface Preview"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 space-y-4">
                <div className="flex items-center space-x-3 text-red-600">
                  <FiActivity className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-[5px] uppercase">Neural-Bitrate Active</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter">THE LAST PROTOCOL</h3>
                <p className="text-gray-400 text-sm font-medium tracking-[3px] uppercase">Streaming in Master-4K node architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposition Matrix */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: FiTv, title: "ULTRA NODE", sub: "Proprietary 4K-HDR transmission protocols with zero fidelity loss." },
              { icon: FiShield, title: "CYBER VAULT", sub: "Decentralized membership identity and end-to-end encoded streams." },
              { icon: FiCpu, title: "CORE SYNC", sub: "Persistent state synchronization across your entire hardware ecosystem." }
            ].map((node, i) => (
              <div key={i} className="glass-card p-12 group hover:border-red-600/20 transition-all duration-700">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-10 group-hover:bg-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-black/40">
                  <node.icon className="text-3xl" />
                </div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-red-600 tracking-[8px] uppercase">Module // 0{i + 1}</span>
                  <h4 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">{node.title}</h4>
                  <p className="text-gray-500 font-light leading-relaxed uppercase text-[10px] tracking-[4px]">{node.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Final Protocol */}
      <section className="py-60 relative text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-red-600/5 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 space-y-16 relative z-10">
          <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
            CHOOSE YOUR <br />
            <span className="text-red-600 red-glow">DESTINY.</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light uppercase tracking-[4px]">
            Join the most advanced membership community in the cinematic universe. Your tier, your rules.
          </p>
          <div className="flex justify-center">
            <Link to="/register" className="btn-premium py-8 px-24 group scale-125">
              <span className="flex items-center space-x-6 text-sm font-black tracking-[6px]">
                <span>COMMENCE ENROLLMENT</span>
                <FiArrowRight className="group-hover:translate-x-4 transition-transform text-xl" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* System Footer */}
      <footer className="py-20 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">STREAMHUB <span className="text-red-600">ALPHA</span></h2>
            <p className="text-[9px] font-black tracking-[10px] uppercase text-gray-700">Digital Membership Architecture v1.4.0</p>
          </div>
          <div className="flex gap-12">
            {[FiCpu, FiGlobe, FiShield, FiActivity].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-700 hover:text-red-600 transition-all duration-500 hover:scale-125">
                <Icon className="text-2xl" />
              </a>
            ))}
          </div>
          <p className="text-[9px] font-black tracking-[4px] uppercase text-gray-800">© 2026 CYBER-CINEMA SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
