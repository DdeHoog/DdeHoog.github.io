import { useState } from 'react';
import {
  FaBriefcase,
  FaShieldAlt,
  FaFlask,
  FaAtom,
  FaGraduationCap,
  FaLightbulb,
  FaRobot,
  FaUniversity,
} from 'react-icons/fa';
import WheelPicker from './WheelPicker';

const experiences = [
  {
    id: 1,
    icon: FaBriefcase,
    name: "CyberMatic",
    title: "Tech Consultant CRM & Development, CyberMatic — Haarlem & Remote.",
    duration: "Nov 2025 - Present",
    details: "Full-time Tech Consultant CRM & Development. Driving development and sales-process optimization & automation across the company.\n\nFull-stack development using PHP, Symfony, Docker, Kubernetes, and REST & GraphQL APIs."
  },
  {
    id: 2,
    icon: FaBriefcase,
    name: "Freelance Dev",
    title: "Freelance full-stack developer — Remote.",
    duration: "Sep 2023 - Oct 2025",
    details: "Built, deployed and maintained a full-stack React web application for Feitengacp.\n\nIntegrated up-to-date stock data through a REST-API integration, streamlining the ordering process for the client and their customers."
  },
  {
    id: 3,
    icon: FaShieldAlt,
    name: "Military Officer",
    title: "Military Officer program, Dutch Royal Military Academy.",
    duration: "Jun 2022 - Mar 2023",
    details: "Intensive military-officer educational program, developing high-pressure leadership, strategic planning, and managerial expertise.\n\nHoned self-discipline and mental/physical resilience while managing complex tasks and squad objectives under extreme conditions."
  },
  {
    id: 4,
    icon: FaFlask,
    name: "Tokyo Research",
    title: "Research exchange program, Shibaura Institute of Technology, Tokyo.",
    duration: "Aug 2021 - Mar 2022",
    details: "Conducted solo research and development under the Shibaura Institute of Technology, culminating in the successful delivery of a working prototype.\n\nResearched, planned and developed a Cypress-microcontroller based EMG-controlled robotic hand, managing the entire project lifecycle independently."
  },
  {
    id: 5,
    icon: FaAtom,
    name: "CERN Coordinator",
    title: "CERN project coordinator & software developer, AUAS — Remote.",
    duration: "Feb 2020 - Feb 2021",
    details: "Coordinated a 7-person team for the Jiskefet project, focused on CERN's Large Hadron Collider experiments. Used Jira in an agile setting to manage team and workflow.\n\nCo-developed a web application to log meta-data, using JavaScript, Mithril, Express, Sequelize (ORM) and Puppeteer."
  },
  {
    id: 6,
    icon: FaGraduationCap,
    name: "Tokyo Studies",
    title: "Shibaura exchange program, Shibaura Institute of Technology, Tokyo.",
    duration: "Sep 2019 - Feb 2020",
    details: "Studied robotics, electrical circuits, 3D modeling and testing, and designing programming-language processors.\n\nExpanded technical specializations and personal development by working far outside my comfort zone — new language, country and methods of learning."
  },
  {
    id: 7,
    icon: FaLightbulb,
    name: "Creative Startups",
    title: "Creative Startups — Amsterdam.",
    duration: "Feb 2019 - Jun 2019",
    details: "Validated and developed a startup idea according to the Lean Startup Methodology as Scrum Master in a 5-person team.\n\nExecuted various experiments and validation methods, effectively pivoting the product around its key features based on market research and customer feedback."
  },
  {
    id: 8,
    icon: FaRobot,
    name: "Rescue on Wheels",
    title: "Rescue on Wheels, AUAS — Amsterdam.",
    duration: "Sep 2018 - Feb 2019",
    details: "Acted as Software/Hardware Developer, Scrum Master and Product Owner in a 4-person team.\n\nDeveloped a Raspberry Pi 3B mobile robot with a live camera feed, remote-controlled via a mobile application. Built using Python on the robot and Java/Android on the controller."
  }
];

const education = [
  {
    id: 1,
    icon: FaUniversity,
    name: "VU AI Pre-master",
    title: "Artificial Intelligence pre-master, Vrije Universiteit Amsterdam.",
    duration: "Completed Aug 2024",
    details: "Master's-level AI coursework to attain AI and ML foundations.\n\nKey courses: Statistical Methods for AI, Intelligent Systems, Machine Learning, Logic and Sets."
  },
  {
    id: 2,
    icon: FaGraduationCap,
    name: "AUAS BSc Tech Computing",
    title: "Bachelor of Science in Technical Computing, Amsterdam University of Applied Sciences.",
    duration: "Graduated Mar 2022 — GPA 3.5 / 4.0",
    details: "A specialization in the information-technology branch of Technical Computing.\n\nKey courses: Data Structures and Algorithms, Automata and Programming, Embedded Systems."
  }
];

const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`
      flex-1 px-2 py-1
      ftext-base font-display
      font-semibold tracking-wide uppercase
      border-b-2 transition-colors duration-150
      ${active
        ? 'text-white border-white'
        : 'text-white/50 border-transparent hover:text-white/80 hover:border-white/40'}
    `}
  >
    {children}
  </button>
);

const Experience = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedExp, setSelectedExp] = useState(experiences[0].id);
  const [selectedEdu, setSelectedEdu] = useState(education[0].id);

  const items = activeTab === 'experience' ? experiences : education;
  const selectedId = activeTab === 'experience' ? selectedExp : selectedEdu;
  const setSelectedId = activeTab === 'experience' ? setSelectedExp : setSelectedEdu;
  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="w-full h-full flex flex-col text-white gap-1 sm:gap-2">
      {/* Tabs */}
      <div className="flex shrink-0 border-b border-white/30">
        <TabButton
          active={activeTab === 'experience'}
          onClick={() => setActiveTab('experience')}
        >
          Experience
        </TabButton>
        <TabButton
          active={activeTab === 'education'}
          onClick={() => setActiveTab('education')}
        >
          Education
        </TabButton>
      </div>

      {/* Body: wheel picker | detail */}
      <div className="flex-1 min-h-0 flex flex-row gap-1 sm:gap-2">
        {/* Left: wheel picker */}
        <div className="w-[38%] sm:w-[35%] h-full">
          <WheelPicker
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Right: detail */}
        <div className="flex-1 min-w-0 h-full bg-black/60 rounded-md p-1.5 sm:p-2 overflow-hidden flex flex-col">
          {selected ? (
            <div className="w-full h-full overflow-y-auto custom-scrollbar pr-1">
              <h2 className="ftext-lg font-display font-bold tracking-wide mb-1 break-words">
                {selected.title}
              </h2>
              <p className="ftext-sm text-white/60 mb-1 sm:mb-2">
                {selected.duration}
              </p>
              {selected.details.split('\n\n').map((para, idx) => (
                <p
                  key={idx}
                  className="ftext-sm mb-1 sm:mb-1.5 break-words whitespace-pre-wrap leading-snug"
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <p className="italic text-white/60 ftext-base">
                Select an item to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;
