import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-16 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="group flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                <FiZap className="text-white text-lg font-black" />
              </div>
              <span className="text-xl font-black tracking-tighter italic uppercase text-white">
                STREAM<span className="text-red-600">HUB</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Experience the next generation of entertainment. Unlimited access to the world's best cinematic productions.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-[4px] uppercase text-white mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link to="/browse" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Library</Link></li>
              <li><Link to="/plans" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Pricing</Link></li>
              <li><Link to="/watch/latest" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">New Assets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-[4px] uppercase text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Help Center</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Account</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-600 text-sm transition-colors uppercase font-bold tracking-widest text-[10px]">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black tracking-[4px] uppercase text-white mb-6">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-red-600/20 hover:text-red-600 rounded-full flex items-center justify-center transition-all border border-white/5"><FiInstagram /></a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-red-600/20 hover:text-red-600 rounded-full flex items-center justify-center transition-all border border-white/5"><FiTwitter /></a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-red-600/20 hover:text-red-600 rounded-full flex items-center justify-center transition-all border border-white/5"><FiFacebook /></a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-red-600/20 hover:text-red-600 rounded-full flex items-center justify-center transition-all border border-white/5"><FiYoutube /></a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">© 2024 STREAMHUB MEDIA INC. ALL ASSETS SECURED.</p>
          <div className="flex space-x-8">
            <a href="#" className="text-[9px] font-black text-gray-700 hover:text-white transition-colors uppercase">Terms</a>
            <a href="#" className="text-[9px] font-black text-gray-700 hover:text-white transition-colors uppercase">Privacy</a>
            <a href="#" className="text-[9px] font-black text-gray-700 hover:text-white transition-colors uppercase">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

