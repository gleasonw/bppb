import React from "react";

export const PBcourts: React.FC = () => {
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

export default PBcourts;
