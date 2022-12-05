import React from "react";
import Image from "next/image";

export const PBcourts: React.FC = () => {
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
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
