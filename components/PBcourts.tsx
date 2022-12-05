import React from "react";
import Image from "next/image";

export const PBcourts: React.FC = () => {
  const [nextCacheAge, setNextCacheAge] = React.useState(new Date());

  //ensure that the cache is updated every 5 minutes?

  React.useEffect(() => {
    const now = new Date();
    if (now.getTime() - nextCacheAge.getTime() > 300000) {
      console.log('old cache');
      setNextCacheAge(now);
    }
  }, [nextCacheAge]);

  return (
    <div className="w-4/5 mx-auto">
      <Image
        src={`https://drive.google.com/uc?export=view&id=1hNQIivHi6k8yCQe3uc-J8ghBQzJqipmk&time=${nextCacheAge.toLocaleString().slice(11, 16)}`}
        width={1000}
        height={500}
        alt="PB Courts"
      />
    </div>
  );
};

export default PBcourts;
