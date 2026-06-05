import React, { useEffect, useRef, useState } from 'react';
import WebGLCanvas from "./WebGLCanvas";
import './App.css';

type Technology = {
  name: string;
  icon: string;
};

type ProductCapability = {
  icon: string;
  title: string;
  description: string;
};

type WorkStep = {
  title: string;
  description: string;
  tone: 'quiet' | 'bright' | 'balanced';
};

const technologies: Technology[] = [
  {
    name: 'Three.js',
    icon: '/icons/three-js-logo.png',
  },
  {
    name: 'ASP.NET Core',
    icon: '/icons/NET_Core_Logo.svg.png',
  },
  {
    name: 'React',
    icon: '/icons/react-logo.png',
  },
  {
    name: '.NET MAUI',
    icon: '/icons/dotnet_bot-maui.svg',
  },
];

const capabilities: ProductCapability[] = [
  {
    icon: 'bolt',
    title: 'Interactive Experiences',
    description: 'Web based 3D and motion-driven interfaces.',
  },
  {
    icon: 'layers',
    title: 'Scalable Backend Systems',
    description: 'High-performance APIs and business logic architecture.',
  },
  {
    icon: 'spark',
    title: 'Modern Web Platforms',
    description: 'Fast, responsive and component-driven applications.',
  },
  {
    icon: 'orbit',
    title: 'Cross-Platform Products',
    description: 'Desktop and mobile applications built from a single codebase.',
  },
];

const workSteps: WorkStep[] = [
  {
    title: 'UNDERSTAND',
    description: 'We focus on the problem before we touch the solution.',
    tone: 'quiet',
  },
  {
    title: 'DESIGN & BUILD',
    description:
      'We design systems and build interactive, performant products with clean architecture.',
    tone: 'bright',
  },
  {
    title: 'DELIVER & SCALE',
    description:
      'We optimize, deploy and ensure systems perform under real-world usage.',
    tone: 'balanced',
  },
];

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTimelineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(timeline);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isContactOpen) {
      return undefined;
    }

    const scrollFormIntoView = () => {
      const form = contactFormRef.current;

      if (!form) {
        return;
      }

      const formRect = form.getBoundingClientRect();
      const overflow = formRect.bottom - window.innerHeight + 24;

      if (overflow > 0) {
        window.scrollBy({ top: overflow, behavior: 'smooth' });
      }
    };

    const earlyScroll = window.setTimeout(scrollFormIntoView, 120);
    const finalScroll = window.setTimeout(scrollFormIntoView, 520);

    return () => {
      window.clearTimeout(earlyScroll);
      window.clearTimeout(finalScroll);
    };
  }, [isContactOpen]);

  const scrollToIntro = () => {
    document.getElementById('technologies')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleContactForm = () => {
    setIsContactOpen((current) => !current);
  };

  return (
    <main className="site-shell">
      <WebGLCanvas />
      <section className="hero-screen" aria-label="Dotweb landing">
        <div className="three-placeholder" aria-hidden="true" />
        <button className="scroll-cue" type="button" onClick={scrollToIntro} aria-label="Scroll to content">
          <img src="/icons/arrow-down-icon.svg" alt="" />
        </button>
      </section>

      <section className="section technologies-screen" id="technologies">
        <header className="section-heading">
          <h1>Modern Technologies. Real products.</h1>
          <p>
            We combine interactive frontend experiences, scalable backend architecture and
            cross-platform development into products built to last.
          </p>
        </header>

        <div
          className={`tech-timeline ${isTimelineVisible ? 'tech-timeline--visible' : ''}`}
          ref={timelineRef}
          aria-label="Technology timeline"
        >
          <div className="timeline-line" aria-hidden="true" />
          {technologies.map((technology) => (
            <article className="tech-item" key={technology.name}>
              <div className="tech-node">
                <img className="tech-logo" src={technology.icon} alt="" />
              </div>
              <p className="tech-name">{technology.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section systems-screen">
        <header className="section-heading">
          <h1>We build systems, not pages</h1>
          <p>Our digital products combine interaction, performance and scalability.</p>
        </header>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article className="capability-item" key={capability.title}>
              <div className={`capability-icon capability-icon--${capability.icon}`} aria-hidden="true">
                <i />
              </div>
              <h2>{capability.title}</h2>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section work-screen">
        <header className="section-heading work-heading">
          <h1>HOW WE WORK</h1>
        </header>

        <div className="work-steps">
          {workSteps.map((step) => (
            <article className={`work-step work-step--${step.tone}`} key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact-screen">
        <div className="contact-wrap">
          <header className="section-heading">
            <h1>Let's build something that lasts</h1>
            <p>Selective about projects. Quality before volume.</p>
          </header>

          <div className="contact-links" aria-label="Contact information">
            <a href="https://github.com/orgs/DotWebRS/repositories" target="_blank" rel="noreferrer">
              <img className="contact-link-icon" src="/icons/github-icon.png" alt="" />
              code samples
            </a>
            <a
              href="https://drive.google.com/drive/u/1/folders/1VzRKOuo0WdjyO_v6j6bpJXa4gnj49pua"
              target="_blank"
              rel="noreferrer"
            >
              <img className="contact-link-icon" src="/icons/portfolio-icon.png" alt="" />
              portfolio
            </a>
          </div>

          <button
            className="project-button"
            type="button"
            onClick={toggleContactForm}
            aria-expanded={isContactOpen}
            aria-controls="contact-form"
          >
            Start a project <span aria-hidden="true">&rarr;</span>
          </button>

          <form
            className={`contact-form ${isContactOpen ? 'contact-form--open' : ''}`}
            id="contact-form"
            ref={contactFormRef}
          >
            <label>
              <span>Name</span>
              <input type="text" name="name" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={4} />
            </label>
            <button type="button">Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
