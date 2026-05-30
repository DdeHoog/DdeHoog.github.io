import { SECTIONS } from '../scene/sections';

const NavBar = ({ onLogoClick, onPlanetClick, showResetHint }) => {
    return (
        <nav
            className="fixed top-0 left-0 w-full h-[60px] flex justify-between px-4 md:px-8
                        items-center text-white font-bold z-10 box-border font-display
                        pointer-events-none"
        >
            <div className="group relative flex items-center pointer-events-auto">
                <button
                    type="button"
                    onClick={onLogoClick}
                    className="bg-transparent border-0 p-0 cursor-pointer text-white font-bold tracking-wider
                                text-2xl sm:text-3xl md:text-4xl lg:text-4xl ml-[-0.5rem]"
                >
                    DDH
                </button>

                {/* Reset hint: fades in with the welcome overlay, and on logo hover. */}
                <div
                    aria-hidden="true"
                    className={`pointer-events-none fixed left-[70px] sm:left-[100px] md:left-[110px]
                                mt-[35px] ml-[15px] -translate-y-1/2 z-20
                                flex items-center gap-2 whitespace-nowrap
                                font-sans font-normal text-[0.8rem] text-white
                                transition-opacity duration-[2000ms] ease-in-out
                                group-hover:opacity-100 ${showResetHint ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="w-0 h-0 border-y-8 border-r-12 border-y-transparent border-r-white" />
                    <p>Click here to reset</p>
                </div>
            </div>

            <ul className="sm:flex gap-4 mt-4 -mr-2 sm:mr-0 sm:mt-4 pointer-events-auto">
                {SECTIONS.map((section) => (
                    <li key={section.id}>
                        <button
                            onClick={() => onPlanetClick(section.id, section.position)}
                            className={section.navColor}
                        >
                            {section.navLabel}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar;
