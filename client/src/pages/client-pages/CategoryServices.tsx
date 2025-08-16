import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabaseClient";

interface Service {
  service_id: number;
  name: string;
  description: string;
}

export default function CategoryServices() {
  const { category } = useParams<{ category: string }>();
  const [services, setServices] = useState<Service[]>([]);

  /*
  useEffect(() => {
    const fetchServices = async () => {
      let { data, error } = await supabase
        .from("government_services")
        .select("*")
        .eq("category", category);
      if (!error) setServices(data);
    };
    fetchServices();
  }, [category]);
  */

  useEffect(() => {
    // Simulated data instead of Supabase fetch
    const sampleData: Service[] = [
      {
        service_id: 1,
        name: "National ID Registration",
        description: "Apply for or renew your National Identity Card.",
      },
      {
        service_id: 2,
        name: "Passport Application",
        description: "Submit a new or renewal application for your passport.",
      },
      {
        service_id: 3,
        name: "Driving License Renewal",
        description: "Easily renew your driving license online.",
      },
    ];

    // Simulate fetch delay
    setTimeout(() => {
      setServices(sampleData);
    }, 500);
  }, [category]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{category} Services</h1>
      {services.map((s) => (
        <div key={s.service_id} className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold">{s.name}</h2>
          <p className="text-gray-600">{s.description}</p>
        </div>
      ))}
    </div>
  );
}
