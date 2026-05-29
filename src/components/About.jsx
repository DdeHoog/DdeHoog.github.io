import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
// `?inline` embeds the (already tiny) avatar as a base64 data URI so it's part
// of the bundle and present the instant the card mounts — no fetch, no
// decode-from-disk flash of the alt text.
import profilePic from '../assets/profilePic.jpg?inline';

const About = () => {
  return (
    <div id="about" className="section w-full h-full flex flex-col text-white p-1 md:p-2 overflow-y-auto custom-scrollbar">
        {/* Top row: Name and profile image */}
        <div className="flex justify-between items-center">
          <h1 className="ftext-2xl font-bold ml-2 sm:ml-4 lg:ml-6">
            Damian <br />
            <span className="ftext-xl font-bold">
              de Hoog <br />
            </span>
          </h1>
          <img
            src={profilePic}
            alt="Damian"
            className="w-[clamp(2.75rem,13cqi,5rem)] h-[clamp(2.75rem,13cqi,5rem)] mr-4 md:mr-2 lg:mr-6 rounded-full object-cover border border-white"
          />
        </div>

        {/* Main content: Introduction */}
        <div className="flex-1 flex items-center justify-center text-center px-2 py-2">
          <p className="ftext-base leading-relaxed max-w-xl">
            I'm a multidisciplinary developer with a passion for engineering, AI, robotics, and creative exploration.
            With a background spanning tech, military, research as well as international and intercultural relations and work. <br />
            <br />
            I thrive in pushing boundaries, both physically and intellectually. Whether it's code, leadership, or building something new — I enjoy the challenge.
            <br />

            <br />
            Let's work together!
          </p>
        </div>

        {/* Bottom row: Contact icons */}
        <div className="flex justify-center gap-2 md:gap-4 items-center pt-0 sm:pt-1 ftext-xs">
        <a
          href="mailto:Damian190085@gmail.com"
          className="sm:flex flex-row items-center gap-1 hover:text-blue-300 transition-colors"
        >
          <FaEnvelope />
          <span className="block sm:inline">Damian190085<wbr />@gmail.com</span>
        </a>
        <a
          href="https://github.com/DdeHoog"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1.5 md:ml-0 sm:flex flex-row items-center gap-1 hover:text-blue-300 transition-colors"
        >
          <FaGithub />
          Github.com/DdeHoog
        </a>
        <a
          href="https://www.linkedin.com/in/damian-de-hoog"
          target="_blank"
          rel="noopener noreferrer"
          className="sm:flex flex-row items-center gap-1 hover:text-blue-300 transition-colors"
        >
          <FaLinkedin />
          linkedin.com/in/DdeHoog
        </a>
      </div>
    </div>
  );
};

export default About;