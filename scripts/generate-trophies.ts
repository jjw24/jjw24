import { GithubApiService } from "../_trophy_src/src/Services/GithubApiService.ts";
import { Card } from "../_trophy_src/src/card.ts";
import { COLORS } from "../_trophy_src/src/theme.ts";

const USERNAME = Deno.args[0];
if (!USERNAME) {
  console.error(
    "Usage: deno run --allow-net --allow-env --allow-read --allow-write scripts/generate-trophies.ts USERNAME",
  );
  Deno.exit(1);
}

async function main() {
  const svc = new GithubApiService();
  const userInfo = await svc.requestUserInfo(USERNAME);
  if (!userInfo || (userInfo as any).totalCommits === undefined) {
    console.error("Failed to fetch user info");
    Deno.exit(2);
  }

  const theme = (COLORS as any)["dracula"] ?? (COLORS as any).default;

  const cardHigh = new Card(
    [],
    ["SECRET", "SSS", "SS", "S"],
    -1,
    10,
    115,
    4,
    0,
    false,
    false,
  );
  const svgHigh = cardHigh.render(userInfo as any, theme);

  const cardLow = new Card(
    [],
    ["AAA", "AA", "A"],
    -1,
    10,
    115,
    4,
    0,
    false,
    false,
  );
  const svgLow = cardLow.render(userInfo as any, theme);

  await Deno.mkdir("assets", { recursive: true });
  await Deno.writeTextFile("assets/trophies-high.svg", svgHigh);
  console.log("Wrote assets/trophies-high.svg");
  await Deno.writeTextFile("assets/trophies-low.svg", svgLow);
  console.log("Wrote assets/trophies-low.svg");
}

await main();
