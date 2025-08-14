import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus } from "lucide-react";

export interface ServiceSectionProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ServiceSection({ title, description, isOpen, onToggle }: ServiceSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full py-4 px-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-primary-300">{description}</p>
            </div>
            <Plus
              className={`w-5 h-5 text-primary-400 transition-transform ${
                isOpen ? "rotate-45" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
        <div className="bg-gray-50 rounded-lg p-2 ">
            <p className="text-sm text-gray-600 text-left">
                Placeholder text
            </p>
            <ul className="mt-2 text-sm text-gray-600 space-y-1 text-left">
                <li>• Service requirements</li>
                <li>• Required documents</li>
                <li>• Processing time</li>
                <li>• Fees and charges</li>
                <li>• Online application links</li>
            </ul>
        </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
