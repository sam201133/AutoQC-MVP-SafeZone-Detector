import jsPDF from "jspdf"
import "jspdf-autotable"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface ErrorData {
  id: number
  frame: number
  timecode: string
  type: string
  severity: "high" | "medium" | "low"
  description?: string
}

interface VideoInfo {
  resolution: string
  aspectRatio: string
  duration: string
  frameRate: string
}

interface ReportData {
  fileName: string
  errors: ErrorData[]
  analysisDate: Date
  videoInfo: VideoInfo
}

export async function generatePDFReport(data: ReportData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  let yPosition = 20

  // Helper function to add page breaks
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Header with AutoQC branding
  doc.setFillColor(59, 130, 246) // Blue color
  doc.rect(0, 0, pageWidth, 25, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("AutoQC", 20, 18)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Video Quality Control Report", pageWidth - 20, 18, { align: "right" })

  yPosition = 40

  // Report metadata
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Analysis Report", 20, yPosition)
  yPosition += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${data.analysisDate.toLocaleString()}`, 20, yPosition)
  yPosition += 8
  doc.text(`Video File: ${data.fileName}`, 20, yPosition)
  yPosition += 15

  // Video Information Section
  checkPageBreak(60)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Video Information", 20, yPosition)
  yPosition += 10

  const videoInfoData = [
    ["Resolution", data.videoInfo.resolution],
    ["Aspect Ratio", data.videoInfo.aspectRatio],
    ["Duration", data.videoInfo.duration],
    ["Frame Rate", data.videoInfo.frameRate],
  ]

  doc.autoTable({
    startY: yPosition,
    head: [["Property", "Value"]],
    body: videoInfoData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 20, right: 20 },
    tableWidth: "auto",
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
    },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 20

  // Summary Section
  checkPageBreak(80)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Analysis Summary", 20, yPosition)
  yPosition += 10

  const totalErrors = data.errors.length
  const highSeverity = data.errors.filter((e) => e.severity === "high").length
  const mediumSeverity = data.errors.filter((e) => e.severity === "medium").length
  const lowSeverity = data.errors.filter((e) => e.severity === "low").length

  const summaryData = [
    ["Total Issues Found", totalErrors.toString()],
    ["High Severity", highSeverity.toString()],
    ["Medium Severity", mediumSeverity.toString()],
    ["Low Severity", lowSeverity.toString()],
  ]

  doc.autoTable({
    startY: yPosition,
    head: [["Category", "Count"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 20, right: 20 },
    tableWidth: "auto",
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
    },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 20

  // Error Distribution Chart (Simple text-based representation)
  checkPageBreak(60)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Error Distribution", 20, yPosition)
  yPosition += 15

  // Create a simple bar chart representation
  const maxCount = Math.max(highSeverity, mediumSeverity, lowSeverity)
  const barWidth = 100

  // High severity bar
  doc.setFillColor(239, 68, 68) // Red
  const highBar = (highSeverity / maxCount) * barWidth
  doc.rect(20, yPosition, highBar, 8, "F")
  doc.setFontSize(10)
  doc.text(`High (${highSeverity})`, 130, yPosition + 6)
  yPosition += 15

  // Medium severity bar
  doc.setFillColor(245, 158, 11) // Amber
  const mediumBar = (mediumSeverity / maxCount) * barWidth
  doc.rect(20, yPosition, mediumBar, 8, "F")
  doc.text(`Medium (${mediumSeverity})`, 130, yPosition + 6)
  yPosition += 15

  // Low severity bar
  doc.setFillColor(59, 130, 246) // Blue
  const lowBar = (lowSeverity / maxCount) * barWidth
  doc.rect(20, yPosition, lowBar, 8, "F")
  doc.text(`Low (${lowSeverity})`, 130, yPosition + 6)
  yPosition += 25

  // Detailed Error List
  checkPageBreak(40)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Detailed Error List", 20, yPosition)
  yPosition += 15

  // Prepare error data for table
  const errorTableData = data.errors.map((error) => [
    error.frame.toString(),
    error.timecode,
    error.type,
    error.severity.toUpperCase(),
    error.description || "No additional details",
  ])

  doc.autoTable({
    startY: yPosition,
    head: [["Frame", "Timecode", "Error Type", "Severity", "Description"]],
    body: errorTableData,
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20 },
      4: { cellWidth: 60 },
    },
    bodyStyles: { fontSize: 9 },
    didParseCell: (data) => {
      // Color code severity column
      if (data.column.index === 3) {
        const severity = data.cell.text[0]?.toLowerCase()
        if (severity === "high") {
          data.cell.styles.textColor = [239, 68, 68]
          data.cell.styles.fontStyle = "bold"
        } else if (severity === "medium") {
          data.cell.styles.textColor = [245, 158, 11]
          data.cell.styles.fontStyle = "bold"
        } else if (severity === "low") {
          data.cell.styles.textColor = [59, 130, 246]
        }
      }
    },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 20

  // Recommendations Section
  checkPageBreak(80)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Recommendations", 20, yPosition)
  yPosition += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const recommendations = [
    "• Review all high-severity issues before final delivery",
    "• Ensure all text and graphics are within safe areas",
    "• Check subtitle positioning and readability",
    "• Verify logo placement meets broadcast standards",
    "• Consider re-rendering sections with multiple issues",
  ]

  recommendations.forEach((rec) => {
    checkPageBreak(8)
    doc.text(rec, 20, yPosition)
    yPosition += 8
  })

  yPosition += 10

  // Footer
  const footerY = pageHeight - 15
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text("Generated by AutoQC - Professional Video Quality Control", 20, footerY)
  doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - 20, footerY, { align: "right" })

  // Add page numbers to additional pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text("Generated by AutoQC - Professional Video Quality Control", 20, footerY)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, footerY, { align: "right" })
  }

  // Save the PDF
  const fileName = `AutoQC_Report_${data.fileName.replace(/\.[^/.]+$/, "")}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}

// Mock error data for demonstration
export const mockErrors = [
  {
    id: 1,
    frame: 1024,
    timecode: "00:00:42:16",
    type: "Logo outside safe area",
    severity: "high" as const,
    description: "Company logo extends beyond the action safe area boundary",
  },
  {
    id: 2,
    frame: 1536,
    timecode: "00:01:04:00",
    type: "Text too close to edge",
    severity: "medium" as const,
    description: "Lower third text is positioned too close to the screen edge",
  },
  {
    id: 3,
    frame: 2048,
    timecode: "00:01:25:12",
    type: "Subtitle outside safe area",
    severity: "high" as const,
    description: "Subtitle text extends beyond the title safe area",
  },
  {
    id: 4,
    frame: 2304,
    timecode: "00:01:36:00",
    type: "Low contrast text",
    severity: "medium" as const,
    description: "Text contrast ratio is below recommended standards",
  },
  {
    id: 5,
    frame: 2560,
    timecode: "00:01:46:16",
    type: "Logo outside safe area",
    severity: "high" as const,
    description: "Watermark logo positioned outside broadcast safe area",
  },
  {
    id: 6,
    frame: 2816,
    timecode: "00:01:57:08",
    type: "Text too close to edge",
    severity: "low" as const,
    description: "Minor text positioning issue near screen boundary",
  },
]
