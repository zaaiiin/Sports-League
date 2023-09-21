import "../index.css";
import LeagueService from "../services/LeagueService";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

function Leaderboard() {
  const [matchesData, setMatchesData] = useState([""]);

  const leagueService = new LeagueService();
  useEffect(() => {
    leagueService.fetchData().then(() => {
      const matches = leagueService.getMatches();
      setMatchesData(matches);
    });
  }, []);

  const leaderboard = leagueService.getLeaderboard(matchesData);

  return (
    <div className="leaderboard-page min-h-screen">
      <Header></Header>
      <div className="heading-container flex mt-60 mb-5 justify-center items-center">
        <h1 className="headings text-2xl font-sans text-heading-color font-bold ">
          League Standings
        </h1>
      </div>
      <div className="table-container flex justify-center">
        <table className="schedule-table w-90 flex-col border-t border-b  border-table-header-border-color">
          <thead className="table-headers text-xs text-table-footer-font-color h-10 font-semibold bg-table-header-border-color">
            <tr>
              <th
                colSpan="2"
                className="team_header text-left font-bold pl-3 w-32 "
              >
                Team Name
              </th>

              <th className="matches-played_header text-center px-2 md:px-6 ">
                MP
              </th>
              <th className="goals-for_header hidden md:table-cell text-center px-6  ">
                GF
              </th>
              <th className="goals-difference_header text-center   px-2  md:hidden">
                GD
              </th>
              <th className="goals-against_headertext-center   px-6  hidden md:table-cell w-12">
                GA
              </th>
              <th className="points-header  text-center px-4 md:px-7  ">
                Points
              </th>
            </tr>
          </thead>

          <tbody className="table-body text-table-footer-font-color font-normal">
            {leaderboard.map((team, index) => (
              <tr className="bg-white h-70 border-t border-b border-table-header-border-color">
                <td className="team-data justify-left mr-10 zd:w-340 lg:w-340">
                  <td className="flag-container h-70 flex justify-left  ml-3 items-center">
                    <img
                      src={`https://flagsapi.codeaid.io/${team.team}.png`}
                      className="team_flag w-53 h-37 "
                      alt="flag"
                    />{" "}
                    <td className="teams font-bold  pl-5 text-left">
                      {team.team}
                    </td>
                  </td>
                </td>
                <td className="place-holder lg:w-0"></td>

                <td className="matches-played text-center  text-sm w-12">
                  {team.totalMatches}
                </td>
                <td className="goals-for hidden md:table-cell text-center text-sm w-12">
                  {team.goalsFor}
                </td>
                <td className="goals-against hidden  md:table-cell text-center text-sm  ">
                  {team.goalsAgainst}
                </td>
                <td className="goal-difference text-sm  text-center  md:hidden">
                  {team.goalDifference}
                </td>
                <td className="points text-header-color font-bold text-base text-center w-12">
                  {team.teamPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Leaderboard;
