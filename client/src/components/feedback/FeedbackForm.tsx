import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {Label} from "@/components/ui/label";
import StarRating from "@/components/ui/StarRating";
import {submitFeedback} from "@/lib/api";
import type {CreateFeedbackRequest} from "@/lib/types";
import {CheckCircleIcon} from "@heroicons/react/24/outline";

interface FeedbackFormProps {
	serviceId: string;
	serviceName: string;
	onFeedbackSubmitted?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
	serviceId,
	serviceName,
	onFeedbackSubmitted,
}) => {
	const [rating, setRating] = useState<number>(0);
	const [description, setDescription] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			setError("Please select a rating");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const feedbackData: CreateFeedbackRequest = {
				serviceId,
				rating,
				description: description.trim() || undefined,
			};

			await submitFeedback(feedbackData);

			setIsSubmitted(true);

			// Reset form
			setRating(0);
			setDescription("");

			// Call callback if provided
			if (onFeedbackSubmitted) {
				onFeedbackSubmitted();
			}
		} catch (error) {
			console.error("Error submitting feedback:", error);
			setError("Failed to submit feedback. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReset = () => {
		setIsSubmitted(false);
		setRating(0);
		setDescription("");
		setError(null);
	};

	if (isSubmitted) {
		return (
			<Card className="border-green-200 bg-green-50">
				<CardContent className="pt-6">
					<div className="text-center">
						<CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-green-900 mb-2">
							Thank you for your feedback!
						</h3>
						<p className="text-green-700 mb-4">
							Your rating and comments have been submitted successfully.
						</p>
						<Button
							variant="outline"
							onClick={handleReset}
							className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
							Submit Another Review
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-[#600D29]">Rate This Service</CardTitle>
				<CardDescription>
					Share your experience with {serviceName} to help others and improve
					the service.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Rating Section */}
					<div className="space-y-2">
						<Label htmlFor="rating" className="text-sm font-medium">
							Your Rating *
						</Label>
						<div className="flex items-center gap-4">
							<StarRating
								rating={rating}
								onRatingChange={setRating}
								size="lg"
								showText
							/>
						</div>
						{rating > 0 && (
							<p className="text-xs text-gray-600">
								You rated this service {rating} out of 5 stars
							</p>
						)}
					</div>

					{/* Description Section */}
					<div className="space-y-2">
						<Label htmlFor="description" className="text-sm font-medium">
							Comments (Optional)
						</Label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Share your experience, suggestions, or any details about the service..."
							className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
							maxLength={500}
						/>
						<p className="text-xs text-gray-500">
							{description.length}/500 characters
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-3">
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}

					{/* Submit Button */}
					<div className="flex gap-3">
						<Button
							type="submit"
							disabled={isSubmitting || rating === 0}
							className="bg-[#600D29] hover:bg-[#600D29]/90 text-white">
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Submitting...
								</>
							) : (
								"Submit Feedback"
							)}
						</Button>

						{(rating > 0 || description.trim()) && (
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setRating(0);
									setDescription("");
									setError(null);
								}}
								disabled={isSubmitting}>
								Clear
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default FeedbackForm;
