import { Link } from "react-router-dom";
import Leaderboard from "../pages/Leaderboard";

const Header = () => {
  return (
    <header className="header flex justify-between h-60 bg-header-color">
      <div className="logo-container flex pl-5 sm:pl-10 justify-start">
        <img className="w-76 sm:w-110" src="/Images/logo.svg" alt="logo" />
      </div>

      <div className="menu flex space-x-2 text-sm sm:space-x-10 sm:text-base text-menu-font-color">
        <Link to="/Schedule">
          <div className="schedule-container flex place-items-center my-4">
            <img
              className="h-25 px-1"
              src="/Images/schedule.png"
              alt="schedule-icon"
            />
            <div className="schedule-button font-sans">Schedule</div>
          </div>
        </Link>

        <Link to="/Leaderboard">
          <div className="leaderboard-container pr-5 sm:pr-10 flex place-items-center my-4">
            <img
              className="h-25 px-1"
              src="/Images/leaderboard.png"
              alt="leaderboard-icon"
            />
            <div className="schedule-button font-sans">Leaderboard</div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
