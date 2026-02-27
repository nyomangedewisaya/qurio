import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, BarChart3, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-[10%] w-72 h-72 bg-brand-400/20 rounded-full blur-[80px] -z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-[10%] w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Evaluasi Pendidikan, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-teal-400">Didefinisikan Ulang.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
            Platform manajemen kuis yang bersih, cerdas, dan aman. Hilangkan kecurangan dengan validasi server, dan dapatkan wawasan analitik secara instan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/register"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.5)] transition-shadow"
            >
              Mulai Eksplorasi <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#fitur"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 glass-card text-slate-700 rounded-2xl font-bold text-lg flex items-center justify-center"
            >
              Pelajari Lebih Lanjut
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  { icon: ShieldCheck, title: "Keamanan Berlapis", desc: "Didukung validasi backend yang solid. Waktu pengerjaan dan PIN ujian aman dari manipulasi klien." },
  { icon: BarChart3, title: "Analitik Real-time", desc: "Pantau tren pengerjaan, tingkat kelulusan, dan temukan celah pemahaman peserta secara instan." },
  { icon: Zap, title: "Performa Kilat", desc: "Dibangun dengan arsitektur modern tanpa jeda. Menyimpan jawaban otomatis (auto-save) tanpa lag." }
];

export const Features = () => {
  return (
    <section id="fitur" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Teknologi di Balik Qurio</h2>
          <p className="text-slate-500 text-lg">Infrastruktur yang dirancang khusus untuk memastikan keadilan dan kenyamanan dalam setiap ujian.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card p-10 rounded-4xl"
            >
              <div className="w-14 h-14 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-6">
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ComingSoon = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-nav rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border-brand-100"
        >
          <div className="absolute inset-0 bg-linear-to-b from-brand-50/50 to-transparent -z-10"></div>
          
          <span className="text-brand-600 font-bold tracking-[0.2em] text-sm uppercase mb-6 block">Tahap Selanjutnya</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Frontend Interaktif Sedang Disiapkan 🚀
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            API Backend tingkat *enterprise* sudah selesai. Kami sedang memoles antarmuka pengguna (UI) yang revolusioner menggunakan integrasi Astro dan React. Bersiaplah untuk pengalaman *seamless*.
          </p>
          
          <div className="inline-flex items-center gap-4 bg-white/60 px-6 py-3 rounded-full border border-white/80 shadow-sm">
            <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">Status Pengembangan: Merakit UI Island</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};