import PBcourts from "./components/PBcourts";
import { Weather } from "./components/Weather";

export default function Home() {
  return (
    <div className={"flex-col flex justify-center bg-black pt-10 text-xl"}>
      <PBcourts />
      <Weather />
    </div>
  );
}
