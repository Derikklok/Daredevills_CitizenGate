import React from "react";
import { Card } from "@/components/ui/card";

export interface ServiceCardProps {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    onClick: () => void;
  }
  
  const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, onClick }) => {
    return (
        <Card
        className="bg-gradient-to-br from-primary-500 to-primary-700 border-none shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
        onClick={onClick}
      >
        <div className="p-6 flex flex-col items-center justify-center text-center h-22
        ">
          <div className="mb-3 p-3 bg-white/10 rounded-full group-hover:bg-white/30 transition-colors duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-medium text-sm leading-tight">
            {title}
          </h3>
        </div>
      </Card>
    )
  }
  
  export default ServiceCard