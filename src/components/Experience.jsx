import { useState } from 'react';

const experiences = [
  {
    id: 1,
    name: "Military Officer",
    title: "Military Officer program, Dutch Royal Military Academy",
    duration: "Jun 2022 - Mar 2023",
    details: "Military officer educational program, containing intensive physical and leadership training as well as designing and managing tasks and squad-tasks. \n\n \n\nBasic training of skills such as; weapons, weapon maintenance and medical. Development of the self under extreme conditions combined with a focus on becoming a good leader and manager. Basic weapons and medical training."
  },
  {
    id: 2,
    name: "Tokyo Research",
    title: "Research exchange program, Tokyo, Japan.",
    duration: "Aug 2021 - Mar 2022",
    details: "Remote work under assistance of the lab at Shibaura Institute of Technology (SIT). \n\n \n\nResearch, planning and development of a cypress microcontroller based EMG-controlled robotic hand. Prototype developed, tested and delivered as product for SIT."
  },
  {
    id: 3,
    name: "CERN Coordinator",
    title: "CERN project coordinator, AUAS.",
    duration: "Feb 2020 - Feb 2021",
    details: "Project manager and coordinator for the Jiskefet project for CERN, an Amsterdam University of Applied Sciences(AUAS) project. \n\nCoordinating a team of 7, as well as software development using Javascript, Mithril, Express, Sequelize (ORM), Pupperteer and Jira. \n\n \n\nDevelopment of a web application for CERN to log meta-data pertaining to the large hadron collider experiments."
  },
  {
    id: 4,
    name: "Tokyo Robotics",
    title: "Studying robotics in Tokyo, Japan.",
    duration: "Sep 2019 - Mar 2020",
    details: "Studying at the Shibaura Institute of Technology in Tokyo, Japan. \n\nCourses contain elements of robotics, electrical circuits, 3D modeling, testing and designing programming language processors. \n\n \n\nThis semester supported personal development through experiences far outside my comfort-zone; new languages, locations and methods of learning as well as furthering my specializations in software and hardware combinatory projects and assignments."
  },
  {
    id: 5,
    name: "Creative Startups",
    title: "Creative startups",
    duration: "Feb 2019 - June 2019",
    details: "Creating, developing and validating our startup ideas according to the lean startup methodology. Using market research and customer validation to verify startup ideas. \n\n \n\nScrum master in a team of 5. \n\nDeveloping a startup idea, pivoting around key features ofthe idea using various experiments and validation methods"
  },
  {
    id: 6,
    name: "AUAS Robotics",
    title: "Rescue on wheels",
    duration: "Sep 2018 - Feb 2019",
    details: "Developing a Raspberry pi 3B mobile robot with live camera feed which can be remote controlled from a mobile or windows device.\n\n \n\nSoftware and hardware development using Java for android, as well as hardware assembly and Python for the robot on wheels. \n\nScrum master in a team of 4 and product owner."
  }
];

const Experience = () => {
  const [selectedId, setSelectedId] = useState(null); // State to hold the ID of the currently selected experience
  const selectedExperience = experiences.find(exp => exp.id === selectedId); // Find the full experience object based on the ID

  const handleExperienceClick = (id) => {
    // If clicked id already selected, set ID to null, otherwise set to clicked id
    setSelectedId(prevId => (prevId === id ? null : id));
  }

  return (
    <div className=" w-full h-full ">
      <div className="flex flex-row w-full h-full gap-1 text-white">
        {/* Left; experience list */}
        <div className="max-w-[35%] h-full max-h-full border-r border-white -ml-1">{/* Left; buttons block */}
          <div className="flex flex-col justify-between gap-1 p-1 h-full w-full">{/* Left; button boxes */}
            {/* Left; button themselves */}
            {experiences.map(exp => (
              <div
                key={exp.id}
                role="button"
                onClick={() => handleExperienceClick(exp.id)} // Use the new handler
                className={`text-wrap text-[0.28rem] sm:text-[0.5rem] md:text-[0.7rem] w-full overflow-hidden flex items-center rounded-md p-0.5 sm:p-1 transition-all duration-200 cursor-pointer
                  ${
                    selectedId === exp.id
                      ? 'bg-white text-black font-semibold border border-black' // Highlight selected experience
                      : 'bg-black text-white font-semibold border border-white hover:bg-gray-600 hover:text-white'}
                      `} // hover behavior
                title={exp.title} // Tooltip for full title
              >
                {exp.name}
              </div>
            ))}
          </div>
        </div>
      {/*Right; experience details*/}
      <div className="text-base h-full w-full flex flex-col overflow-hidden"> {/* Details section block */ }
        <div className="bg-black h-full w-full p-0 rounded-md flex-1 min-h-0 overflow-auto">{/*Right; black background */}
          {selectedExperience ? ( // If an experience is selected, display its details
            <div className="w-full h-full break-words whitespace-pre-wrap overflow-y-auto p-1 custom-scrollbar">{/*Right; div containing the elements */}
              {/*Right; title */}
              <h2 className="text-[0.5rem] font-bold mb-2 break-words sm:text-[0.8rem] md:text-[0.9rem] xl:text-[0.8] 2xl:text-lg   ">
                {selectedExperience.title}</h2>

              {/*Right; duration*/}
              {/* <p className="text-[0.4rem] sm:text-[0.55rem] md:text-[0.65rem]  xl:text-[0.8] 2xl:text-[0.7]  text-gray-400 mb-2 ">
                {selectedExperience.duration}</p> */}

              {/*Right; detail text*/}
              {selectedExperience.details.split('\n\n').map((para, index) => (
                <p 
                key={index} 
                className="text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] xl:text-[0.8] 2xl:text-[0.7rem] whitespace-pre-wrap break-words">
                  {para}
                </p>
              ))}
              
            </div>
          ) : ( 
            // If no experience is selected, display the prompt
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-white text-center align-middle p-4 italic text-[0.6rem] sm:text-[0.8rem] md:text-[0.9rem] xl:text-base 2xl:text-lg">
                Select an experience from the left to view its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Experience;