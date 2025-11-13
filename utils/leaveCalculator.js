const Leave = require("../models/leave");
const ProfessionalDetails = require("../models/professionalDetails");

/**
 * Calculate available casual leaves for the current year
 * Each employee earns 1 casual leave per month, max 12 per year.
 * Unused leaves roll over automatically each month.
 */
exports.calculateAvailableCasualLeaves = async (employeeId) => {
  const professional = await ProfessionalDetails.findOne({ employeeId });
  if (!professional) throw new Error("Professional details not found");

  const joiningDate = new Date(professional.dateOfJoining);
  const today = new Date();

  // Start of current year
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // If employee joined this year, start from joining date
  const startDate = joiningDate > startOfYear ? joiningDate : startOfYear;

  // Calculate how many months completed since startDate till today
  const monthsCompleted =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    (today.getMonth() - startDate.getMonth()) + 1;

  // Earned leaves (1 per month)
  const earnedLeaves = Math.min(monthsCompleted, 12);

  // Find all approved leaves for this year
  const approvedLeaves = await Leave.find({
    employeeId,
    status: "Approved",
    fromDate: { $gte: startOfYear },
  });

  const usedLeaves = approvedLeaves.reduce(
    (sum, l) => sum + (l.daysApplied || 0),
    0
  );

  const remainingLeaves = Math.max(earnedLeaves - usedLeaves, 0);

  return {
    earnedLeaves,
    usedLeaves,
    remainingLeaves,
    joiningDate,
  };
};
