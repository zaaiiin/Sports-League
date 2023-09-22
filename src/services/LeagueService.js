import matchers from "@testing-library/jest-dom/matchers";
const axios = require("axios");

class LeagueService {
  constructor() {
    this.matches = [];
  }

  //Sets the match array to matches.

  setMatches(matches) {
    if (Array.isArray(matches)) {
      this.matches = matches;
    } else {
      console.error("Input is not an array of matches");
    }
  }

  // Returns the full list of matches.

  getMatches() {
    return this.matches;
  }

  // Asynchronic function to fetch the data from the server.

  async getApiVersion() {
    try {
      const response = await axios.get(
        "https://sports-league-server.vercel.app/api/data",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      return data.versions[0].version;
    } catch (error) {
      console.error("Error fetching API version:", error);
      throw error;
    }
  }

  async getAccessToken() {
    try {
      const response = await axios.get(
        "https://sports-league-server.vercel.app/api/data"
      );

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

      const response = await axios.get(
        "https://sports-league-server.vercel.app/api/data",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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

  //returns {Array} List of teams representing the leaderboard.

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
