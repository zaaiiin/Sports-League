require("jest-fetch-mock").enableMocks();
fetchMock.dontMock();

import LeagueService from "../src/services/LeagueService";

describe("leaderboard", () => {
  let leagueService;

  beforeEach(() => {
    leagueService = new LeagueService();
  });

  test("check-leaderboard-teams", async () => {
    const matches = [
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "Brazil",
        awayTeam: "France",
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 1,
      },
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "Brazil",
        awayTeam: "Slovenia",
        matchPlayed: true,
        homeTeamScore: 3,
        awayTeamScore: 1,
      },
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "France",
        awayTeam: "Slovenia",
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0,
      },
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "France",
        awayTeam: "Germany",
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 1,
      },
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "Brazil",
        awayTeam: "Germany",
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0,
      },
      {
        matchDate: Date.now(),
        stadium: "Maracanã",
        homeTeam: "Germany",
        awayTeam: "Slovenia",
        matchPlayed: true,
        homeTeamScore: 4,
        awayTeamScore: 0,
      },
    ];
    leagueService.setMatches(matches);

    const leaderboard = leagueService.getLeaderboard(matches);

    const firstTeam = leaderboard[0];
    expect(firstTeam.team).toBe("Germany");
    expect(firstTeam.totalMatches).toBe(3);
    expect(firstTeam.goalsFor).toBe(5);
    expect(firstTeam.goalsAgainst).toBe(0);
    expect(firstTeam.teamPoints).toBe(7);

    const secondTeam = leaderboard[1];
    expect(secondTeam.team).toBe("Brazil");
    expect(secondTeam.totalMatches).toBe(3);
    expect(secondTeam.goalsFor).toBe(5);
    expect(secondTeam.goalsAgainst).toBe(2);
    expect(secondTeam.teamPoints).toBe(7);

    const thirdTeam = leaderboard[2];
    expect(thirdTeam.team).toBe("France");
    expect(thirdTeam.totalMatches).toBe(3);
    expect(thirdTeam.goalsFor).toBe(1);
    expect(thirdTeam.goalsAgainst).toBe(3);
    expect(thirdTeam.teamPoints).toBe(1);

    const fourthTeam = leaderboard[3];
    expect(fourthTeam.team).toBe("Slovenia");
    expect(fourthTeam.totalMatches).toBe(3);
    expect(fourthTeam.goalsFor).toBe(1);
    expect(fourthTeam.goalsAgainst).toBe(7);
    expect(fourthTeam.teamPoints).toBe(1);
  });
});
