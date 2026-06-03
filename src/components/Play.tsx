import { motion } from "framer-motion";

export default function Play() {
  const experiments = [
    {
      id: 1,
      title: "Sort by Size",
      span: "col-span-2",
      gradient: "from-[#101c36] to-[#040916]",
      details: "Procedural sorting visualizer based on circle packing algorithms",
    },
    {
      id: 2,
      title: "Fabric",
      span: "col-span-1",
      gradient: "from-[#3a1d1d] to-[#160a0a]",
      details: "Verlet integration physics simulation for dynamic cloth sheets",
    },
    {
      id: 3,
      title: "Threads",
      span: "col-span-1",
      gradient: "from-[#1d3a33] to-[#0a1613]",
      details: "Multi-agent pathfinding vector fields tracing generative patterns",
    },
    {
      id: 4,
      title: "Kunai",
      span: "col-span-2",
      gradient: "from-[#2b2b2b] to-[#0f0f0f]",
      details: "3D interactive weapon rendered using lightweight canvas mathematics",
    },
    {
      id: 5,
      title: "flob.mp4",
      span: "col-span-1",
      gradient: "from-[#2c1d3a] to-[#110a17]",
      details: "Fluid dynamics fluid simulation with mouse interaction",
    },
    {
      id: 6,
      title: "Loose Threads",
      span: "col-span-1",
      gradient: "from-[#3a351d] to-[#17150a]",
      details: "Perlin noise-based thread rendering creating aesthetic meshes",
    },
    {
      id: 7,
      title: "Alien Threads",
      span: "col-span-2",
      gradient: "from-[#162a1a] to-[#08110b]",
      details: "Generative organic strands using fractal math algorithms",
    },
    {
      id: 8,
      title: "Bezier Flowers",
      span: "col-span-1",
      gradient: "from-[#102b3a] to-[#041016]",
      details: "Interactive SVG bezier curve flowers opening on hover",
    },
    {
      id: 9,
      title: "Circle Wrap",
      span: "col-span-1",
      gradient: "from-[#2b103a] to-[#0f0416]",
      details: "Trigonometric wave coordinate wrapping animations",
    },
  ];

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="px-3 w-full max-w-5xl mt-16 flex flex-col gap-36 pb-48"
    >
      {/* Section Header */}
      <motion.h2
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-accent text-sm tracking-widest font-Spline_Sans_Mono"
      >
        // Play
      </motion.h2>

      {/* Masonry / Custom Grid */}
      <div className="grid grid-cols-2 gap-6 md:gap-8 justify-around px-1">
        {experiments.map((exp) => (
          <motion.div
            key={exp.id}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.02 }}
            className={`pt-[60%] sm:pt-[50%] md:pt-[45%] relative overflow-hidden rounded-2xl border border-accent/10 glass-panel hover-glow transition-all duration-300 ${exp.span}`}
          >
            {/* Background Shader-like Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${exp.gradient} transition-transform duration-700 hover:scale-105`}
            />

            {/* Dynamic Math Graphic Display */}
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/20">
              <svg
                className="w-full h-full opacity-5 hover:opacity-10 absolute pointer-events-none transition-all duration-300"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.25" />
                <path d="M 0,50 Q 25,10 50,50 T 100,50" stroke="currentColor" strokeWidth="0.25" />
                <path d="M 0,50 Q 25,90 50,50 T 100,50" stroke="currentColor" strokeWidth="0.25" />
              </svg>

              {/* Title & Detail Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2 z-10 select-none">
                <div>
                  <span className="text-highlight font-Spline_Sans_Mono text-xs uppercase tracking-widest block opacity-70 mb-1">
                    Lab Exp {exp.id}
                  </span>
                  <h3 className="text-accent text-lg md:text-xl font-medium tracking-tight">
                    {exp.title}
                  </h3>
                  <p className="text-accent/60 text-[10px] md:text-xs font-light mt-1 max-w-[35ch] leading-relaxed">
                    {exp.details}
                  </p>
                </div>
                
                <div className="text-accent/25 font-Spline_Sans_Mono text-xs font-light self-end hidden md:block">
                  :: interactive ::
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
