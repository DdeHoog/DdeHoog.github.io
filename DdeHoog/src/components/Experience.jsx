import { useState } from 'react';

const experiences = [
  {
    id: 1,
    title: "Military Officer program, Dutch Royal Military Academy",
    duration: "Jun 2022 - Mar 2023",
    details: "Military officer educational program, containing intensive physical training, leadership training and, designing and managing tasks and squad-tasks. Personal development of skills and the self under extreme conditions combined with a focus on becoming a good leader and manager."
  },
  {
    id: 2,
    title: "Research exchange program, Tokyo, Japan.",
    duration: "Aug 2021 - Mar 2022",
    details: "Remote work udner assistance of the lab at Shibaura Institute of Technology. Solo work on research, planning and development of a working protoype. Researching, planning and development of an EMG controlled robotic hand. Prototype developed and deliverd."
  },
  {
    id: 3,
    title: "CERN project coordinator, Amsterdam university of applied sciences.",
    duration: "Feb 2020 - Feb 2021",
    details: "Project coordinator for the Jiskefet project for CERN, coordinating a team of 7. AS well as software developer using Javascript, Mithril, Express, Sequelize (ORM), Pupperteer and Jira. Developing a web application for CERN to log meta-data pertaining to the large hadron collider experiments."
  },
  {
    id: 4,
    title: "Robotics in Tokyo, Japan.",
    duration: "Sep 2019 - Mar 2020",
    details: "Studying at the Shibaura Institute of Technology in Tokyo, Japan. Courses contain elements of robotics, electrical circuits, 3D modeling, testing and designing programming language processors. This semester supported personal development through experiences far outside my comfort-zone; new languages, locations and methods of learning as well as further my specializations."
  },
  {
    id: 5,
    title: "Creative startups",
    duration: "Feb 2019 - June 2019",
    details: "Creating, developing and validating our own startup idea according to the lean startup methodology. Scrum master in a team of 5. Developing a startup idea, pivoting around key features ofthe idea using various experiments and validation methods"
  },
  {
    id: 6,
    title: "Rescue on wheels",
    duration: "Sep 2018 - Feb 2019",
    details: "Software and hardware development - Python/Java android developer, hardware assembly and scrum master in a team of 4. Developing a Raspberry pi 3B mobile robot with live camera feed which can be remote controlled from a mobile device or windows device."
  }
];

const Experience = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedExperience = experiences.find(exp => exp.id === selectedId);

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-1 text-white">
      {/* Left; experience list */}
      <div className="w-full md:w-1/3 border-r border-white overflow-y-auto max-h-[40vh] md:max-h-[80vh]]">
        <div className="flex flex-col gap-1 p-0">
          {experiences.map(exp => (
            <div
              key={exp.id}
              role="button"
              onClick={() => setSelectedId(exp.id)}
              className={`text-xs truncate w-full overflow-hidden text-ellipsis whitespace-nowrap flex  items-center rounded-md p-1 transition-all duration-200 cursor-pointer
                ${
                  selectedId === exp.id
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'bg-gray-950 text-slate-300 hover:bg-gray-800'}
                    `}
              title={exp.title} // Tooltip for full title
            >
              {exp.title}
            </div>
          ))}
        </div>
      </div>
    {/*Right; experience details*/}
    <div className="text-xs w-full md:w-2/3 ">
      <div class="bg-black h-full p-3 rounded-md overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
        {selectedExperience ? (
          <div>
            <h2 class="text-xl font-bold mb-2">{selectedExperience.title}</h2>
            <p class="text-sm text-gray-400 mb-4">{selectedExperience.duration}</p>
            <p>{selectedExperience.details}</p>
          </div>
        ) : (
          <p class="text-white-500 italic">Select an experience to see details</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default Experience;