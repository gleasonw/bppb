import React from "react";

export const PBcourts: React.FC = () => {
  // re render every minute
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  console.log("re render");
  return (
      <img
        src={`http://drive.google.com/uc?time=${time}?export=view&id=1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk`}
        alt="Battle Point PB"
        className="mx-auto"
      />
  );
};

export default PBcourts;
