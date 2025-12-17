/**
 * Disclaimer component for legal/medical safety notices
 */
export function Disclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-xl">⚠️</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Important Disclaimer:</strong> EyeCare AI provides educational information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. If you have concerns about your eye health, please consult with an eye care professional (optometrist or ophthalmologist).
          </p>
        </div>
      </div>
    </div>
  );
}
