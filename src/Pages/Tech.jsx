import { useEffect, useState } from "react";
import Label from "../Elements/Label";

export default function Tech() {
  const [techData, setTechData] = useState([]);

  useEffect(() => {
    fetch("/assets/tech.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tech.json");
        return res.json();
      })
      .then((data) => setTechData(data))
      .catch((err) => console.error(err));
  }, []);

  const grouped = techData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item.name);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 text-white px-6 sm:px-12">
      <div className="flex items-center mb-10">
        <h2 className="text-2xl font-bold mr-4">Skills</h2>
        <div className="flex-grow h-[1px] bg-[#E8FF9B]"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {Object.entries(grouped).map(([category, items], idx) => (
          <div key={idx}>
            <Label text={category} className="text-base mb-2 capitalize" />
            <div className="flex flex-wrap gap-2">
              {items.map((tech, i) => (
                <span
                  key={i}
                  className="cursor-pointer bg-[#2A2A2A] text-gray-300 px-3 py-1 rounded-md text-sm font-medium hover:bg-[#E8FF9B]/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
