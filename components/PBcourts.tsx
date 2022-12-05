import React from "react";
import Image from "next/image";

export const PBcourts: React.FC = () => {
  // re render every minute
  const [time, setTime] = React.useState<string>(
    new Date().toLocaleTimeString()
  );
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  console.log("re render");
  return (
    <div className="w-4/5 mx-auto">
      <Image
        src={`https://drive.google.com/uc?export=view&id=1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk&time=${time}`}
        width={1000}
        height={500}
        alt="PB Courts"
      />
    </div>
  );
};

export default PBcourts;
