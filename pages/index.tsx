import PBcourts from "./PBcourts";
import { Weather } from "./Weather";

export default function Home() {
  return (
    <div className={'m-20 flex-col flex justify-center'}>
      <PBcourts/>
      <Weather/>
    </div>
  );
}
