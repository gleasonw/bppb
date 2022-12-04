import PBcourts from "../components/PBcourts";
import { Weather } from "../components/Weather";

export default function Home() {
  return (
    <div className={'m-10 flex-col flex justify-center'}>
      <PBcourts/>
      <Weather/>
    </div>
  );
}
