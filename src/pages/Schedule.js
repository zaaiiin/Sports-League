import "../index.css";
import LeagueService from "../services/LeagueService";
import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

function Schedule() {
  const [matchesData, setMatchesData] = useState([""]);
  const [matchDates, setMatchDates] = useState([""]);

  const leagueService = new LeagueService();
  useEffect(() => {
    leagueService
      .fetchData()
      .then(() => {
        const matches = leagueService.getMatches();
        setMatchesData(matches);

        const allDates = convertTimestamps(matches);
        const formattedDates = allDates.map((eachDate) =>
          formatDates(eachDate)
        );
        setMatchDates(formattedDates);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  //convert timestamps to full date format
  function convertTimestamps(matches) {
    const timestamps = matches.map((match) => match.matchDate);
    const allDates = timestamps.map((timestamp) => new Date(timestamp));
    return allDates;
  }

  //format dates according to W3C
  function formatDates(date) {
    const days = date.getDate();
    const months = date.getMonth();
    const years = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours() % 12 || 12;

    return `${days}.${months}.${years} ${hours}.${minutes}`;
  }

  return (
    <div className="schedule-page min-h-screen">
      <div className="leagueboard min-h-screen flex flex-col">
        <Header></Header>

        <div className="heading-container flex mt-60 mb-5 justify-center items-center">
          <h1 className="headings text-2xl font-sans text-heading-color font-bold ">
            League Schedule
          </h1>
        </div>

        <div className="table-container flex justify-center">
          <table className="schedule-table w-90 flex-col border-t border-b  border-table-header-border-color">
            <thead className="table-headers text-xs font-bold text-table-footer-font-color h-10 bg-table-header-border-color place-items-center ">
              <tr>
                <th className="matchDate hidden md:table-cell font-semibold text-left pl-5 w-9">
                  Date/Time
                </th>

                <th className="stadiums hidden lg:table-cell font-semibold text-left pl-16 w-48">
                  Stadium
                </th>

                <th colSpan="2" className="home-team_header text-right">
                  Home Team
                </th>

                <th></th>
                <th colSpan="2" className="away-team_header text-left">
                  Away Team
                </th>
              </tr>
            </thead>
            <tbody className="table-body text-base font-bold text-table-footer-font-color ">
              {matchesData.map((match, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white h-70 border-t border-b border-table-header-border-color"
                      : "bg-even-rows-color h-70 border-t border-b  border-table-header-border-color"
                  }`}
                >
                  <td className="matchTimes hidden md:table-cell text-sm font-normal pl-5 w-9 text-right ">
                    {matchDates[index]}
                  </td>

                  <td className="stadium hidden lg:table-cell text-sm font-normal pl-16  w-48">
                    {match.stadium}
                  </td>

                  <td className="home-teams" colSpan="2">
                    <div className="flex items-center justify-between">
                      <p className="text-right flex-grow">{match.homeTeam}</p>
                      {/* <td className="flag-container h-70 flex justify-center items-center "> */}
                      <img
                        src={`https://flagsapi.codeaid.io/${match.homeTeam}.png`}
                        className="home-team_flag w-53 h-37 ml-4"
                        alt="flag"
                      />{" "}
                    </div>
                  </td>
                  {/* </td> */}

                  <td className="scores text-center mx-0 px-0">
                    {match.homeTeamScore} : {match.awayTeamScore}
                  </td>

                  <td className="flag-container h-70 flex" colSpan="2">
                    <div className="flex items-center justify-between">
                      <img
                        src={`https://flagsapi.codeaid.io/${match.awayTeam}.png`}
                        className="away-team_flag w-53 h-37 mr-4"
                        alt="flag"
                      />

                      <p className="away-teams text-left ">{match.awayTeam}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default Schedule;
