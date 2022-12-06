import PBcourts from "./components/PBcourts";
import { Weather } from "./components/Weather";

export default function Home() {
  return (
    <div className={"flex-col flex justify-center bg-stone-700 pt-10 text-xl w-full h-full"}>
      <PBcourts />
      <Weather />
    </div>
  );
}
