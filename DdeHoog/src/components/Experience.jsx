import { useState } from 'react';

const experiences = [
  {
    id: 1,
    name: "Military officer",
    title: "Military Officer program, Dutch Royal Military Academy",
    duration: "Jun 2022 - Mar 2023",
    details: "Military officer educational program, containing intensive physical training, leadership training and, designing and managing tasks and squad-tasks. Personal development of skills and the self under extreme conditions combined with a focus on becoming a good leader and manager."
  },
  {
    id: 2,
    name: "Tokyo research",
    title: "Research exchange program, Tokyo, Japan.",
    duration: "Aug 2021 - Mar 2022",
    details: "Remote work under assistance of the lab at Shibaura Institute of Technology. Solo work on research, planning and development of a working protoype. Researching, planning and development of an EMG controlled robotic hand. Prototype developed and deliverd."
  },
  {
    id: 3,
    name: "CERN project",
    title: "CERN project coordinator, AUAS.",
    duration: "Feb 2020 - Feb 2021",
    details: "Project coordinator for the Jiskefet project for CERN, coordinating a team of 7. As well as software developer using Javascript, Mithril, Express, Sequelize (ORM), Pupperteer and Jira. Developing a web application for CERN to log meta-data pertaining to the large hadron collider experiments."
  },
  {
    id: 4,
    name: "Tokyo robotics",
    title: "Studying robotics in Tokyo, Japan.",
    duration: "Sep 2019 - Mar 2020",
    details: "Studying at the Shibaura Institute of Technology in Tokyo, Japan. Courses contain elements of robotics, electrical circuits, 3D modeling, testing and designing programming language processors. This semester supported personal development through experiences far outside my comfort-zone; new languages, locations and methods of learning as well as further my specializations."
  },
  {
    id: 5,
    name: "Creative startups",
    title: "Creative startups",
    duration: "Feb 2019 - June 2019",
    details: "Creating, developing and validating our own startup idea according to the lean startup methodology. Scrum master in a team of 5. Developing a startup idea, pivoting around key features ofthe idea using various experiments and validation methods"
  },
  {
    id: 6,
    name: "AUAS robotics",
    title: "Rescue on wheels",
    duration: "Sep 2018 - Feb 2019",
    details: "Software and hardware development - Python/Java android developer, hardware assembly and scrum master in a team of 4. Developing a Raspberry pi 3B mobile robot with live camera feed which can be remote controlled from a mobile device or windows device."
  }
];

const Experience = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selectedExperience = experiences.find(exp => exp.id === selectedId);

  return (
    <div className=" w-full h-full min-h-0 flex-col">
      <div className="flex flex-row md:flex-row w-full h-full gap-1 text-white">
        {/* Left; experience list */}
        <div className="max-w-[35%] h-full md:w-[35%] max-h-full border-r border-white -ml-1">{/* Left; buttons block */}
          <div className="flex flex-col justify-between gap-2 p-1 h-full ">{/* Left; button boxes */}
            {/* Left; button themselves */}
            {experiences.map(exp => (
              <div
                key={exp.id}
                role="button"
                onClick={() => setSelectedId(exp.id)}
                className={`text-[0.4rem] sm:text-[0.6rem] md:text-[0.7rem] w-full overflow-hidden flex items-center rounded-md p-1 transition-all duration-200 cursor-pointer
                  ${
                    selectedId === exp.id
                      ? 'bg-gray-700 text-white font-semibold' // Highlight selected experience
                      : 'bg-gray-950 text-slate-300 hover:bg-gray-800'}
                      `} // hover behavior
                title={exp.title} // Tooltip for full title
              >
                {exp.name}
              </div>
            ))}
          </div>
        </div>
      {/*Right; experience details*/}
      <div className="text-base h-full w-[65%] md:w-[65%] flex flex-col min-w-0 overflow-hidden"> {/* Details section block */ }
        <div className="bg-black h-full w-full p-0 rounded-md flex-1 min-h-0 overflow-auto">{/*Right; black background */}
          {selectedExperience ? (
            <div className="w-full h-full break-words whitespace-pre-wrap overflow-y-auto p-1">{/*Right; div containing the elements */}
              {/*Right; title */}
              <h2 className="text-[0.5rem] font-bold mb-2 break-words sm:text-[0.9rem] 2xl:text-base  md:text-base">
                {selectedExperience.title}</h2>

              {/*Right; duration*/}
              <p className="text-[0.4rem] sm:text-[0.6rem] md:text-[0.8rem] 2xl:text-base  text-gray-400 mb-2 ">
                {selectedExperience.duration}</p>

              {/*Right; detail text*/}
              <p className="text-[0.4rem] sm:text-[0.5rem] md:text-[0.7rem] 2xl:text-base whitespace-pre-wrap break-words">
                {selectedExperience.details}</p>
            </div>
          ) : ( 
            <p className="text-white-500 italic">Select an experience to see details</p>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Experience;