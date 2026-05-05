import { SECTIONS } from '../scene/sections';
import Planet from './Planet';

const Planets = ({ onPlanetClick }) => {
  return (
    <>
      {SECTIONS.map((section) => (
        <Planet
          key={section.id}
          section={section}
          onPlanetClick={onPlanetClick}
        />
      ))}
    </>
  );
};

export default Planets;
