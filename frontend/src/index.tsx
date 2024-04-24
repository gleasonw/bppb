import { Weather } from "./components/Weather";
import github from "./assets/github.svg";
import React from "react";

export default function Home() {
  return (
    <div
      className={
        "flex-col flex pt-10 text-xl text-white h-full justify-between"
      }
    >
      <PBcourts />
      <Weather />
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

const PBcourts: React.FC = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  //ensure the image is updated every 2 minutes
  React.useEffect(() => {
    const interval = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      120000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto">
      <img
        src={`https://bppb-production.up.railway.app/court?time=${time}`}
        width={1000}
        height={500}
        alt="PB Courts"
      />
    </div>
  );
};
