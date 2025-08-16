import React from "react";
import {StarIcon} from "@heroicons/react/24/solid";
import {StarIcon as StarOutlineIcon} from "@heroicons/react/24/outline";
import {cn} from "@/lib/utils";

interface StarRatingProps {
	rating: number;
	onRatingChange?: (rating: number) => void;
	readonly?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
	showText?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
	rating,
	onRatingChange,
	readonly = false,
	size = "md",
	className,
	showText = false,
}) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	const handleStarClick = (starRating: number) => {
		if (!readonly && onRatingChange) {
			onRatingChange(starRating);
		}
	};

	const getRatingText = (rating: number) => {
		if (rating === 0) return "No rating";
		if (rating === 1) return "Poor";
		if (rating === 2) return "Fair";
		if (rating === 3) return "Good";
		if (rating === 4) return "Very Good";
		if (rating === 5) return "Excellent";
		return `${rating} stars`;
	};

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<div className="flex items-center">
				{[1, 2, 3, 4, 5].map((star) => {
					const isFilled = star <= rating;
					const StarComponent = isFilled ? StarIcon : StarOutlineIcon;

					return (
						<button
							key={star}
							type="button"
							className={cn(
								sizeClasses[size],
								"transition-colors",
								isFilled ? "text-yellow-400" : "text-gray-300",
								!readonly && "hover:text-yellow-300 cursor-pointer",
								readonly && "cursor-default"
							)}
							onClick={() => handleStarClick(star)}
							disabled={readonly}
							aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}>
							<StarComponent className="w-full h-full" />
						</button>
					);
				})}
			</div>
			{showText && (
				<span className="text-sm text-gray-600 ml-2">
					{getRatingText(rating)}
				</span>
			)}
		</div>
	);
};

export default StarRating;
