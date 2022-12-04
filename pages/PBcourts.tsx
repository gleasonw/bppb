import React from "react";
import Image from "next/image";

export const PBcourts: React.FC = () => {
  // re render every minute
  const [time, setTime] = React.useState<string>(new Date().toLocaleTimeString());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  console.log("re render");
  return (
    <Image
      src={`https://drive.google.com/uc?time=${time}?export=view&id=1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk`}
      alt="Battle Point PB"
      className="mx-auto"
      width={1000}
      height={1000}
    />
  );
};

export default PBcourts;
