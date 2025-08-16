import React, {useEffect, useState} from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import StarRating from "@/components/ui/StarRating";
import {getServiceFeedback} from "@/lib/api";
import type {Feedback} from "@/lib/types";
import {
	ChatBubbleLeftRightIcon,
	ExclamationTriangleIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface FeedbackDisplayProps {
	serviceId: string;
	serviceName: string;
	refreshTrigger?: number; // Use this to trigger refresh from parent
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
	serviceId,
	serviceName,
	refreshTrigger = 0,
}) => {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [showAll, setShowAll] = useState<boolean>(false);

	const fetchFeedback = async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await getServiceFeedback(serviceId);
			// Sort by creation date, newest first
			const sortedFeedback = data.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			setFeedbacks(sortedFeedback);
		} catch (error) {
			console.error("Error fetching feedback:", error);
			setError("Failed to load feedback");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeedback();
	}, [serviceId, refreshTrigger]);

	const calculateAverageRating = () => {
		if (feedbacks.length === 0) return 0;
		const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
		return Math.round((sum / feedbacks.length) * 10) / 10; // Round to 1 decimal place
	};

	const getRatingDistribution = () => {
		const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
		feedbacks.forEach((feedback) => {
			distribution[feedback.rating as keyof typeof distribution]++;
		});
		return distribution;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const displayedFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 3);
	const averageRating = calculateAverageRating();
	const distribution = getRatingDistribution();

	if (loading) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#600D29]"></div>
						<span className="ml-3 text-gray-600">Loading feedback...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="border-red-200">
				<CardContent className="pt-6">
					<div className="text-center py-8">
						<ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<p className="text-red-700 mb-4">{error}</p>
						<Button
							variant="outline"
							onClick={fetchFeedback}
							className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
							<ArrowPathIcon className="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-[#600D29]">
					<ChatBubbleLeftRightIcon className="h-5 w-5" />
					User Feedback
				</CardTitle>
				<CardDescription>
					See what others are saying about {serviceName}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{feedbacks.length === 0 ? (
					<div className="text-center py-8">
						<ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No feedback yet
						</h3>
						<p className="text-gray-600">
							Be the first to share your experience with this service.
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{/* Overall Rating Summary */}
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center justify-between mb-3">
								<div>
									<h4 className="text-lg font-semibold text-gray-900">
										Overall Rating
									</h4>
									<div className="flex items-center gap-2 mt-1">
										<StarRating
											rating={Math.round(averageRating)}
											readonly
											size="md"
										/>
										<span className="text-lg font-medium text-gray-900">
											{averageRating}
										</span>
										<span className="text-sm text-gray-600">
											({feedbacks.length} review
											{feedbacks.length !== 1 ? "s" : ""})
										</span>
									</div>
								</div>
							</div>

							{/* Rating Distribution */}
							<div className="grid grid-cols-5 gap-2 text-xs">
								{[5, 4, 3, 2, 1].map((rating) => (
									<div key={rating} className="text-center">
										<div className="text-gray-600 mb-1">{rating}★</div>
										<div className="bg-gray-200 rounded-full h-2">
											<div
												className="bg-yellow-400 h-2 rounded-full"
												style={{
													width: `${
														feedbacks.length > 0
															? (distribution[
																	rating as keyof typeof distribution
															  ] /
																	feedbacks.length) *
															  100
															: 0
													}%`,
												}}></div>
										</div>
										<div className="text-gray-500 mt-1">
											{distribution[rating as keyof typeof distribution]}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Individual Feedback */}
						<div className="space-y-4">
							<h4 className="font-medium text-gray-900">Recent Reviews</h4>
							{displayedFeedbacks.map((feedback) => (
								<div
									key={feedback.id}
									className="border border-gray-200 rounded-lg p-4">
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-2">
											<StarRating rating={feedback.rating} readonly size="sm" />
											<Badge variant="secondary">
												{feedback.rating === 5
													? "Excellent"
													: feedback.rating === 4
													? "Very Good"
													: feedback.rating === 3
													? "Good"
													: feedback.rating === 2
													? "Fair"
													: "Poor"}
											</Badge>
										</div>
										<span className="text-sm text-gray-500">
											{formatDate(feedback.createdAt)}
										</span>
									</div>
									{feedback.description && (
										<p className="text-gray-700 text-sm leading-relaxed">
											{feedback.description}
										</p>
									)}
								</div>
							))}
						</div>

						{/* Show More/Less Button */}
						{feedbacks.length > 3 && (
							<div className="text-center">
								<Button
									variant="outline"
									onClick={() => setShowAll(!showAll)}
									className="border-[#600D29] text-[#600D29] hover:bg-[#600D29] hover:text-white">
									{showAll
										? `Show Less`
										: `Show All ${feedbacks.length} Reviews`}
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default FeedbackDisplay;
