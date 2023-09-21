import matchers from "@testing-library/jest-dom/matchers";
const axios = require("axios");

/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 *
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM,
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.
 *
 */
class LeagueService {
  constructor() {
    this.matches = [];
  }

  /**
   * Sets the match schedule.
   * Match schedule will be given in the following form:
   * [
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      },
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      }
   * ]
   *
   * @param {Array} matches List of matches.
   */
  setMatches(matches) {
    if (Array.isArray(matches)) {
      this.matches = matches;
    } else {
      console.error("Input is not an array of matches");
    }
  }

  /**
   * Returns the full list of matches.
   *
   * @returns {Array} List of matches.
   */
  getMatches() {
    return this.matches;
  }

  /**
   * Asynchronic function to fetch the data from the server.
   */
  // Import the 'node-fetch' library

  async getApiVersion() {
    try {
      // Use 'fetch' to simulate an HTTP request to your Express server
      const response = await axios.get("http://localhost:3001/api/data", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Since 'fetch' is making a request to your Express server, the response
      // should contain the data from "db.json," including the API version
      const data = await response.json();

      // Access the API version property in 'data'
      return data.versions[0].version; // Assuming 'versions' is an array
    } catch (error) {
      console.error("Error fetching API version:", error);
      throw error;
    }
  }

  async getAccessToken() {
    try {
      const response = await axios.get("http://localhost:3001/api/data");

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;

      if (data.accessTokens && data.accessTokens.length > 0) {
        return data.accessTokens[0].access_token;
      } else {
        throw new Error("Access token not found");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  async fetchData() {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get("http://localhost:3001/api/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data; // Axios automatically parses JSON responses

      if (Array.isArray(data.matches)) {
        this.setMatches(data.matches);
      } else {
        throw new Error("Match data not found");
      }
    } catch (error) {
      console.log("error fetching data:", error);
      throw error;
    }
  }

  /**
   * Returns the leaderboard in a form of a list of JSON objecs.
   *
   * [
   *      {
   *          teamName: [STRING]',
   *          matchesPlayed: [INTEGER],
   *          goalsFor: [INTEGER],
   *          goalsAgainst: [INTEGER],
   *          points: [INTEGER]
   *      },
   * ]
   *
   * @returns {Array} List of teams representing the leaderboard.
   */

  getLeaderboard(matches) {
    const leaderboard = {};

    function updateleaderboard(leaderboard, team, goalsFor, goalsAgainst) {
      if (leaderboard.hasOwnProperty(team)) {
        leaderboard[team].goalsFor += goalsFor;
        leaderboard[team].goalsAgainst += goalsAgainst;
        leaderboard[team].goalDifference += goalsFor - goalsAgainst;
        leaderboard[team].totalGoals += goalsFor;
        leaderboard[team].totalMatches++;

        if (goalsFor > goalsAgainst) {
          leaderboard[team].wins++;
          leaderboard[team].teamPoints += 3;
        } else if (goalsFor < goalsAgainst) {
          leaderboard[team].losses++;
        } else {
          leaderboard[team].draws++;
          leaderboard[team].teamPoints += 1;
        }
      } else {
        leaderboard[team] = {
          goalsFor: goalsFor,
          goalsAgainst: goalsAgainst,
          totalGoals: goalsFor,
          goalDifference: goalsFor - goalsAgainst,
          totalMatches: 1,
          wins: goalsFor > goalsAgainst ? 1 : 0,
          losses: goalsFor < goalsAgainst ? 1 : 0,
          draws: goalsFor === goalsAgainst ? 1 : 0,
          teamPoints:
            goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0,
        };
      }
    }

    matches.forEach((match) => {
      const { homeTeam, homeTeamScore, awayTeam, awayTeamScore } = match;
      updateleaderboard(leaderboard, homeTeam, homeTeamScore, awayTeamScore);
      updateleaderboard(leaderboard, awayTeam, awayTeamScore, homeTeamScore);
    });

    const mappedLeaderboard = Object.entries(leaderboard).map(
      ([teamName, teamData]) => ({
        team: teamName,
        ...teamData, // Include all the existing team data
      })
    );

    const sortedTeams = Object.entries(mappedLeaderboard)
      .sort(([, teamA], [, teamB]) => {
        if (teamA.teamPoints !== teamB.teamPoints) {
          return teamB.teamPoints - teamA.teamPoints;
        } else {
          // Tiebreaker 1: Head-to-head points
          // Create a mini leaderboard for tied teams and sort by points

          const teamsOfInterest = [teamA.team, teamB.team];
          const tiedLeaderboard = {};
          const filteredMatches = matches.filter((match) => {
            return (
              match.matchPlayed &&
              teamsOfInterest.includes(match.homeTeam) &&
              teamsOfInterest.includes(match.awayTeam)
            );
          });
          filteredMatches.forEach((match) => {
            const { homeTeam, homeTeamScore, awayTeam, awayTeamScore } = match;

            updateleaderboard(
              tiedLeaderboard,
              homeTeam,
              homeTeamScore,
              awayTeamScore
            );
            updateleaderboard(
              tiedLeaderboard,
              awayTeam,
              awayTeamScore,
              homeTeamScore
            );
          });

          const tiedTeamsLeaderboard = Object.entries(tiedLeaderboard).sort(
            ([, a], [, b]) => a.teamPoints - b.teamPoints
          );

          if (
            tiedTeamsLeaderboard[0][1].teamPoints !==
            tiedTeamsLeaderboard[1][1].teamPoints
          ) {
            return (
              tiedTeamsLeaderboard[0][1].teamPoints -
              tiedTeamsLeaderboard[1][1].teamPoints
            );
          } else {
            // Tiebreaker 2: Goal difference
            const goalDifferenceA = teamA.goalDifference;
            const goalDifferenceB = teamB.goalDifference;
            if (goalDifferenceA !== goalDifferenceB) {
              return goalDifferenceB - goalDifferenceA;
            } else {
              // Tiebreaker 3: Scored goals
              if (teamA.goalsFor !== teamB.goalsFor) {
                return teamB.goalsFor - teamA.goalsFor;
              } else {
                // Tiebreaker 4: Alphabetical order by team name
                return teamA.team.localeCompare(teamB.team);
              }
            }
          }
        }
      })
      .map(([team, data]) => ({ team, ...data }));

    return sortedTeams;
  }
}

export default LeagueService;
