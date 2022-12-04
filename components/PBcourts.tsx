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
    <div className='w-4/5 mx-auto'> 
      <iframe
        src={`https://drive.google.com/file/d/1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk/preview?time=${time}`}
        allow="autoplay"
        width={"100%"}
        height={400}
        className="mx-auto"
      />
    </div>
  );
};

export default PBcourts;
