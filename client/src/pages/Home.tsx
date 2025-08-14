import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import citizenGateLogo from "../components/images/CitizenGate.png";
import CategoryCard from "../components/CategoryCard";
import {
  AcademicCapIcon,
  HeartIcon,
  TruckIcon,
  HomeIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

// Clerk auth
import { useClerk, useUser } from "@clerk/clerk-react";
import SideMenu from "./client-pages/SideMenu";

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();

  const categoryIcons: Record<string, JSX.Element> = {
    Healthcare: <HeartIcon className="h-6 w-6 text-pink-600" />,
    Education: <AcademicCapIcon className="h-6 w-6 text-pink-600" />,
    Transport: <TruckIcon className="h-6 w-6 text-pink-600" />,
    Housing: <HomeIcon className="h-6 w-6 text-pink-600" />,
    Finance: <CurrencyDollarIcon className="h-6 w-6 text-pink-600" />,
  };

  const handleClear = () => {
    setSearch("");
  };

  useEffect(() => {
    const mockCategories = [
      "Healthcare",
      "Education",
      "Transport",
      "Housing",
      "Finance",
    ];
    setCategories(mockCategories);
  }, []);

  const displayedCategories = showAll ? categories : categories.slice(0, 4);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <img
          src={citizenGateLogo}
          alt="Logo or banner"
          className="h-10 w-auto"
        />

        {isSignedIn ? (
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImageUrl}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-gray-300"
            />
            <Bars3Icon
              className="h-7 w-7 text-[#600D29] cursor-pointer"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-[#600D29] text-white px-4 py-1 rounded text-sm"
          >
            Login →
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Discover services"
          className="w-full pl-10 pr-10 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        {search && (
          <XMarkIcon
            className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleClear}
          />
        )}
      </div>

      {/* Categories */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mt-4 text-[#600D29] font-sans">
          Categories
        </h2>
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm text-[#600D29]"
        >
          {showAll ? "Show Less" : "See All"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {displayedCategories.map((category) => (
          <CategoryCard
            key={category}
            name={category}
            icon={categoryIcons[category]}
            onClick={() => console.log("Clicked:", category)}
          />
        ))}
      </div>

      {/* Featured */}
      <h2 className="text-xl font-bold mt-4 text-[#600D29] font-sans">
        Featured
      </h2>
      <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#600D29] via-[#A8174E] to-[#600D29]">
        <button
          onClick={() => navigate("/voter-registration")}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg w-full text-left"
        >
          <span className="bg-[#600D29] text-white p-2 rounded-full">🗳️</span>
          <div>
            <div className="font-bold text-[#600D29]">Voter Registration</div>
            <div className="text-sm text-gray-500">
              Register to vote in upcoming elections
            </div>
          </div>
        </button>
      </div>

      {/* Side Menu Drawer */}
      {menuOpen && (
        <SideMenu user={user} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
