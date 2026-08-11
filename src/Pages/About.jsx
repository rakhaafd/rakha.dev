import Button from "../Elements/Button";
import profileImg from "../assets/img/profile.jpeg";
import { FaFileDownload } from "react-icons/fa";

export default function About() {

  return (
    <section
      id="about"
      className="text-[var(--color-text)] py-20 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-12"
    >
      <div className="flex-1 flex justify-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--color-accent)]/30 shadow-lg transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(232,255,155,0.2)]">
            <img
              src={profileImg}
              alt="Rakha Profile"
              className="cursor-pointer w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="absolute inset-0 rounded-full bg-[var(--color-accent)]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left space-y-5">
        <h1 className="relative inline-block text-3xl md:text-4xl font-bold text-white">About Me</h1>

        <p className="text-gray-300 leading-relaxed sm:text-lg max-w-xl mx-auto md:mx-0">
          Hola! I'm <span className="text-[var(--color-accent)] font-medium">Rakha Fausta Adinata Raharja</span>,
          a <span className="text-white font-medium">Fullstack Developer</span> and <span className="text-white font-medium">Cybersecurity Learner.</span>
          <br /><br />
          I'm passionate about building scalable web applications that balance user experience and system architecture.
          <br /> <br />
          Beyond development, I explore cybersecurity to better understand how modern systems work.
        </p>
        <div className="flex justify-center md:justify-start gap-4 pt-4">
          <a
            href="https://drive.google.com/file/d/15VSDJtyIu0xBvrhYQFJj6kUBJSmrgDxX/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              icon={<FaFileDownload className="text-lg" />}
              text="Download CV"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
