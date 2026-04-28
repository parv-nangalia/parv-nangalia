import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Github,
  Linkedin,
  Mail,
  Send,
  Phone,
  Code2,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const RESUME_URL = `${import.meta.env.BASE_URL}Parv_Nangalia_Resume.pdf`;

/* ─────────────────────────────────────────────────────────────────
   Section data — short, metric-led, written in my voice
   ───────────────────────────────────────────────────────────────── */

const experiences = [
  {
    role: "Consultant",
    company: "Deloitte",
    years: "Sep 2024 — Present",
    bullets: [
      "Shipped vendor & purchase-order workflows on a DRF supply-chain app, with Redis caching and async task queues keeping the inventory module snappy.",
      "Led the CRM exit from Heroku onto AWS — tiered cold data into S3 Glacier and cut hosting spend while killing vendor lock-in.",
      "Built a 140M-record AWS pipeline (AppFlow + Lambda + DASK) using batching and parallelism, and automated Fargate Docker rollouts via EventBridge → AWS Batch.",
    ],
  },
  {
    role: "Senior Systems Engineer",
    company: "Infosys",
    years: "Aug 2021 — Aug 2024",
    bullets: [
      "Designed REST APIs for a microservices ops platform that unified monitoring + ServiceNow ticketing — cut average ticket resolution time by ~30%.",
      "Migrated a legacy Spring codebase to Spring Boot on Java 8+, slashing config sprawl and making the team actually want to touch it.",
      "Stood up OAuth + MFA on a Spring Boot service and tuned a React + Redux frontend for snappier renders.",
    ],
  },
  {
    role: "Security Intern",
    company: "Senselearners Technologies",
    years: "Jul 2022 — Aug 2022",
    bullets: [
      "Ran an end-to-end ISO 27001 ISMS rollout on a hypothetical org — implemented controls, monitored, reviewed and remediated.",
      "Performed OWASP-style vulnerability assessments against live boxes to harden their security posture.",
      "Led a 10-person intern team to on-time delivery, owning knowledge transfer and reducing operational gaps.",
    ],
  },
];

const projects = [
  {
    title: "Gyaandweep",
    link: "https://www.gyaandweep.com",
    desc: "A full-stack learning + community platform I architected end-to-end — blogging, forums, an archival library and an LMS. Grew to 500K+ views and 2K+ organic users in two years.",
    bullets: [
      "Designed the AWS topology myself: ECS Fargate, ECR, S3, CloudFront, Route 53, ALB, VPC with private subnets, and a Bastion-fronted RDS, all glued together by CodePipeline CI/CD.",
      "Offloaded heavy work to AWS Lambda + dedicated background workers, isolating async traffic from request-path containers.",
      "Wired in OAuth, Twilio and OpenAI for translation across 30+ languages — drove a 50% lift in sign-ups, 120% traffic growth and 180% longer sessions via SEO.",
    ],
    tags: ["Django/DRF", "React", "AWS ECS", "Lambda", "OpenAI", "Twilio"],
  },
  {
    title: "eCommerce Microservices",
    link: "https://github.com/parv-nangalia/eCommerce",
    desc: "A scalable Spring Boot e-commerce backend split into independent services with Eureka-based discovery and health checks.",
    bullets: [
      "Auth, user, product and order services — designed for 10K concurrent users with 99.9% target uptime.",
      "Reactive non-blocking IO on the product service, SOLID-driven service boundaries on auth and order.",
    ],
    tags: ["Spring Boot", "Microservices", "Eureka", "Reactive"],
  },
  {
    title: "AndroSafe",
    desc: "Android app that classifies any APK or URL as safe or unsafe by training on signatures of whitelisted domains.",
    bullets: [
      "RandomForest + SVM classifiers reaching 96%+ accuracy on real-world samples.",
      "Python ML stack (NumPy, pandas, BeautifulSoup) wrapped in Flask, called from an Android Studio client.",
    ],
    tags: ["ML", "Flask", "Android", "RandomForest", "SVM"],
  },
  {
    title: "LipReader",
    desc: "Image-to-text classifier that tracks the lip region to help mute users practice spoken words.",
    bullets: [
      "CNN trained on lip-movement frames hits ~90% accuracy on individual letters and short words.",
      "MATLAB + OpenCV for tracking and feature extraction, with a custom neural net for classification.",
    ],
    tags: ["CNN", "OpenCV", "MATLAB"],
  },
  {
    title: "Social Network (POC)",
    link: "https://github.com/parv-nangalia/SocialNetwork.git",
    desc: "A Django proof-of-concept social backend covering profiles, search, feed, posts, friend requests and auth.",
    bullets: [
      "ViewSet-driven modular architecture with scope-based throttling, paginated DB calls and a Dockerised CI/CD path.",
    ],
    tags: ["Django", "DRF", "Docker"],
  },
  {
    title: "Kabaad-e",
    link: "https://parv-nangalia.github.io/Kabaad-e/",
    desc: "React front-end for an e-waste marketplace, focused on a tailored buyer/seller journey and persistent local-storage state across reloads.",
    bullets: [
      "Custom React hooks for cart, listings and form state.",
      "Local-storage persistence layer so partial work survives reloads.",
    ],
    tags: ["React", "Hooks", "LocalStorage"],
  },
];

const technologies = [
  "Spring Boot",
  "Django",
  "DRF",
  "React",
  "Redux",
  "AWS",
  "Docker",
  "Microservices",
  "REST",
  "PostgreSQL",
  "SQL",
  "Redis",
  "CI/CD",
  "Git",
];
const languages = ["Java", "Python", "JavaScript", "SQL", "C/C++", "Shell"];
const certifications = [
  "AWS Certified Cloud Practitioner",
  "Microsoft Certified — AZ-900",
  "Spring AI & Spring Framework in Depth — Udemy",
  "Redux Toolkit — Udemy",
];
const education = [
  {
    school: "Scaler",
    year: "2024",
    detail:
      "Specialisation in Software Development — DSA, LLD, HLD, Data Engineering and Product Management.",
  },
  {
    school: "PES University (PESIT), Bangalore",
    year: "2021",
    detail:
      "B.Tech in Computer Science — Computing Models & Algorithms. Captained the basketball team in 3rd year.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   Summary cards — fixed-size, short blurb + "View details" CTA
   ───────────────────────────────────────────────────────────────── */

interface SummaryProps {
  onOpen: () => void;
}

function CardShell({
  children,
  onOpen,
}: {
  children: React.ReactNode;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full text-left bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 hover:border-primary/40 transition-all duration-300 cursor-pointer h-[300px] flex flex-col justify-between shadow-2xl"
    >
      {children}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <span className="text-xs font-mono text-white/50 tracking-widest">
          VIEW DETAILS
        </span>
        <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </button>
  );
}

function ExperienceSummary({ onOpen }: SummaryProps) {
  return (
    <CardShell onOpen={onOpen}>
      <div>
        <span className="text-xs font-mono text-primary tracking-widest">
          01 — EXPERIENCE
        </span>
        <h2 className="text-3xl font-display font-bold text-white mt-2 mb-3">
          Backend &amp; cloud, mostly.
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Currently a Consultant at <span className="text-white">Deloitte</span>{" "}
          shipping SCM workflows and 140M-record AWS pipelines. Three years
          before that at <span className="text-white">Infosys</span> on Spring
          Boot microservices and OAuth/MFA platforms.
        </p>
      </div>
    </CardShell>
  );
}

function ProjectsSummary({ onOpen }: SummaryProps) {
  return (
    <CardShell onOpen={onOpen}>
      <div>
        <span className="text-xs font-mono text-primary tracking-widest">
          02 — PROJECTS
        </span>
        <h2 className="text-3xl font-display font-bold text-white mt-2 mb-3">
          Stuff I've shipped
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          A 500K-view learning platform on AWS, a Spring Boot microservice
          e-commerce stack, an ML-powered Android security classifier, a
          CNN lip-reader and a couple of side experiments.
        </p>
      </div>
    </CardShell>
  );
}

function AboutSummary({ onOpen }: SummaryProps) {
  return (
    <CardShell onOpen={onOpen}>
      <div>
        <span className="text-xs font-mono text-primary tracking-widest">
          03 — ABOUT
        </span>
        <h2 className="text-3xl font-display font-bold text-white mt-2 mb-3">
          Hi, I'm Parv.
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Software engineer based in India — PES University CSE grad, Scaler
          alum. I live in the backend and on AWS, but enjoy front-end and a
          bit of ML on the side. Builder by reflex.
        </p>
      </div>
    </CardShell>
  );
}

function ContactSummary({ onOpen }: SummaryProps) {
  return (
    <CardShell onOpen={onOpen}>
      <div>
        <span className="text-xs font-mono text-primary tracking-widest">
          04 — CONTACT
        </span>
        <h2 className="text-3xl font-display font-bold text-white mt-2 mb-3">
          Let's talk
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Open to interesting roles, collaborations and side-project chats.
          Email, phone, socials and a downloadable copy of my resume — all
          inside.
        </p>
      </div>
    </CardShell>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Detailed views (rendered inside the dialog)
   ───────────────────────────────────────────────────────────────── */

function ExperienceDetail() {
  return (
    <div className="space-y-6">
      {experiences.map((exp, i) => (
        <div
          key={i}
          className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-primary before:rounded-full before:shadow-[0_0_8px_rgba(255,175,51,0.85)] after:absolute after:left-[3px] after:top-4 after:bottom-[-24px] after:w-[2px] after:bg-white/10 last:after:hidden"
        >
          <h3 className="text-lg font-medium text-white">{exp.role}</h3>
          <div className="text-sm text-primary mb-2">
            {exp.company}
            <span className="text-white/40 ml-2">{exp.years}</span>
          </div>
          <ul className="space-y-2">
            {exp.bullets.map((b, j) => (
              <li
                key={j}
                className="text-white/75 text-sm leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-white/40 before:rounded-full"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ProjectsDetail() {
  return (
    <div className="divide-y divide-white/10">
      {projects.map((proj, i) => (
        <div key={i} className="py-5 first:pt-0 last:pb-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-lg font-display font-medium text-white">
              {proj.title}
            </h3>
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:text-white transition-colors flex items-center gap-1"
              >
                Visit <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-white/80 text-sm mb-3 leading-relaxed">
            {proj.desc}
          </p>
          {proj.bullets && (
            <ul className="space-y-1.5 mb-3">
              {proj.bullets.map((b, j) => (
                <li
                  key={j}
                  className="text-white/70 text-sm leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-white/40 before:rounded-full"
                >
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2">
            {proj.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 text-primary border border-primary/40 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutDetail() {
  return (
    <div className="space-y-6">
      <p className="text-white/80 leading-relaxed">
        I'm Parv — a software engineer who lives somewhere between backend
        services and cloud infrastructure, with a soft spot for ML and
        application security. Currently a Consultant at Deloitte, working
        on supply-chain platforms and large-scale AWS data pipelines.
      </p>
      <p className="text-white/80 leading-relaxed">
        Outside of client work I built and ran{" "}
        <span className="text-white">Gyaandweep</span>, a full-stack learning
        platform that grew past half a million views, and I keep a small
        rotation of side projects going to learn whatever the day job
        doesn't cover.
      </p>

      <div>
        <h3 className="text-sm font-mono text-primary mb-3 tracking-widest">
          EDUCATION
        </h3>
        <div className="space-y-3">
          {education.map((e) => (
            <div key={e.school}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-white font-medium text-sm">
                  {e.school}
                </span>
                <span className="text-white/40 text-xs font-mono">
                  {e.year}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {e.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-mono text-primary mb-3 tracking-widest">
          TECHNOLOGIES
        </h3>
        <div className="flex flex-wrap gap-2">
          {technologies.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/90"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-mono text-primary mb-3 tracking-widest">
          LANGUAGES
        </h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/90"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-mono text-primary mb-3 tracking-widest">
          CERTIFICATIONS
        </h3>
        <ul className="space-y-1.5 text-sm text-white/80">
          {certifications.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="text-primary mt-1">·</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ContactDetail() {
  type ContactForm = { name: string; email: string; message: string };
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  const onSubmit = () => {
    toast.success("Message sent!", {
      description: "Thanks for reaching out — I'll get back to you soon.",
    });
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="text-white/80 text-sm space-y-2">
        <a
          href="mailto:nangaliaparv@gmail.com"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Mail className="w-4 h-4" />
          nangaliaparv@gmail.com
        </a>
        <a
          href="tel:+918889647595"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          +91 88896-47595
        </a>
      </div>

      <div className="flex gap-3">
        <a
          href="https://github.com/parv-nangalia"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="p-3 hover:bg-white/10 hover:text-primary rounded-full border border-white/15 transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://leetcode.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="LeetCode"
          className="p-3 hover:bg-white/10 hover:text-primary rounded-full border border-white/15 transition-colors"
        >
          <Code2 className="w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="p-3 hover:bg-white/10 hover:text-primary rounded-full border border-white/15 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href="mailto:nangaliaparv@gmail.com"
          aria-label="Email"
          className="p-3 hover:bg-white/10 hover:text-primary rounded-full border border-white/15 transition-colors"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>

      {/* ── Resume link (opens in new tab) ── */}
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-primary/40 px-4 py-3 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white">View my resume</div>
            <div className="text-xs text-white/50 truncate">
              Opens the latest PDF in a new tab
            </div>
          </div>
        </div>
        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-[#2a1a05] transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </a>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
        <Input
          placeholder="Your Name"
          {...register("name", { required: true })}
          className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
        />
        <Input
          type="email"
          placeholder="hello@example.com"
          {...register("email", { required: true })}
          className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
        />
        <Textarea
          placeholder="What's on your mind?"
          rows={4}
          {...register("message", { required: true })}
          className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary resize-none"
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Message
        </Button>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Public component
   ───────────────────────────────────────────────────────────────── */

const SECTION_META = [
  { title: "Experience", description: "Where I've worked and what I built." },
  {
    title: "Selected Projects",
    description: "Side projects, products and research builds.",
  },
  { title: "About Me", description: "Background, skills and certifications." },
  {
    title: "Get in touch",
    description: "Email, socials, resume and a quick note form.",
  },
];

export default function SectionContent({
  index,
  open,
  onOpenChange,
}: {
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const summaries = [
    <ExperienceSummary key="exp" onOpen={() => onOpenChange(true)} />,
    <ProjectsSummary key="proj" onOpen={() => onOpenChange(true)} />,
    <AboutSummary key="about" onOpen={() => onOpenChange(true)} />,
    <ContactSummary key="contact" onOpen={() => onOpenChange(true)} />,
  ];

  const details = [
    <ExperienceDetail key="exp-d" />,
    <ProjectsDetail key="proj-d" />,
    <AboutDetail key="about-d" />,
    <ContactDetail key="contact-d" />,
  ];

  const meta = SECTION_META[index];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {summaries[index]}
        </motion.div>
      </AnimatePresence>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white/10 border-white/20 backdrop-blur-2xl text-white max-w-2xl max-h-[85vh] overflow-y-auto custom-scroll shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-white">
              {meta.title}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {meta.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">{details[index]}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
