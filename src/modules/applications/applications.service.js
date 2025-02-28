import Application from "../../DB/models/application.model.js";
import JobOpportunity from "../../DB/models/JobOpportunity.model.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const exportApplicationsToExcel = async (req, res, next) => {
  const { companyId, date } = req.params;

  const excelFolderPath = path.join(process.cwd(), "src", "ExcelFiles");
  if (!fs.existsSync(excelFolderPath)) {
    fs.mkdirSync(excelFolderPath, { recursive: true });
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const jobOpportunities = await JobOpportunity.find({
    companyId: companyId,
  }).select("_id");

  const jobIds = jobOpportunities.map((job) => job._id);

  const applications = await Application.find({
    jobId: { $in: jobIds },
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).populate("userId", "firstName lastName email");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");

  worksheet.columns = [
    { header: "First Name", key: "firstName", width: 15 },
    { header: "Last Name", key: "lastName", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Job ID", key: "jobId", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Applied At", key: "appliedAt", width: 20 },
  ];

  applications.forEach((application) => {
    worksheet.addRow({
      firstName: application.userId.firstName,
      lastName: application.userId.lastName,
      email: application.userId.email,
      jobId: application.jobId,
      status: application.status,
      appliedAt: application.createdAt,
    });
  });

  const filePath = path.join(excelFolderPath, `applications_${companyId}_${date}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  res.download(filePath, (err) => {
    if (err) {
      return next(err);
    } else {
      fs.unlinkSync(filePath);
    }
  });

  return res.status(200).json({ message: "Applications exported to Excel." });
};