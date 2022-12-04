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
    <iframe
      src={`https://drive.google.com/file/d/1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk/preview?time=${time}`}
      width="640"
      height="300"
      allow="autoplay" 
      className='mx-auto'
      />
  );
};

export default PBcourts;
