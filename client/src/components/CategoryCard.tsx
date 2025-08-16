import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed

interface CategoryCardProps {
  name: string;
  icon: JSX.Element;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, onClick }) => {
  return (

        <Button
        onClick={onClick}
        className="flex-col items-center space-x-2 px-4 py-8 rounded text-white shadow-sm hover:shadow-md"
        style={{
            background: "linear-gradient(90deg, #47021A 0%, #6B0333 100%)",
        }}
        >
        {icon}
        <span className="font-medium">{name}</span>
        </Button>

  );
};

export default CategoryCard;
