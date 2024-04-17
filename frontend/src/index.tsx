import PBcourts from "./components/PBcourts";
import { Weather } from "./components/Weather";
import github from "./assets/github.svg";

export default function Home() {
  return (
    <div className={"flex-col flex justify-center pt-10 text-xl text-white"}>
      <PBcourts />
      <div>Weather data temporarily out of service...</div>
      <a
        href={"https://github.com/gleasonw/bppb"}
        target={"_blank"}
        className={"self-center p-10"}
      >
        <img src={github} alt={"github"} className={"w-10 h-10"} />
      </a>
    </div>
  );
}
