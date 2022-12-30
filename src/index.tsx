import PBcourts from "./components/PBcourts";
import { Weather } from "./components/Weather";

export default function Home() {
  return (
    <div className={"flex-col flex justify-center pt-10 text-xl text-white"}>
      <PBcourts />
      <Weather />
    </div>
  );
}
