"use client"

import { Flag, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import {Badge} from "@/components/ui/badge"

type Report = {
  id: string
  entityType: "Question" | "Blog" | "Comment" | "Answer"
  entityTitle: string
  reportReason: string
  reportDate: string
  status: "Pending" | "Under Review" | "Resolved" | "Rejected"
}

const SAMPLE_REPORTS: Report[] = [
  { 
    id: "r1", 
    entityType: "Question", 
    entityTitle: "Incorrect solution provided for derivative problem", 
    reportReason: "Wrong answer in solution",
    reportDate: "2024-01-08", 
    status: "Under Review" 
  },
  { 
    id: "r2", 
    entityType: "Blog", 
    entityTitle: "Spam content in comments section", 
    reportReason: "Spam/Advertisement",
    reportDate: "2024-01-05", 
    status: "Resolved" 
  },
  { 
    id: "r3", 
    entityType: "Comment", 
    entityTitle: "Inappropriate language used", 
    reportReason: "Offensive content",
    reportDate: "2024-01-03", 
    status: "Resolved" 
  },
  { 
    id: "r4", 
    entityType: "Answer", 
    entityTitle: "Misleading explanation in organic chemistry", 
    reportReason: "Incorrect information",
    reportDate: "2024-01-01", 
    status: "Rejected" 
  },
]

function getStatusIcon(status: Report["status"]) {
  switch (status) {
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "Under Review":
      return <AlertCircle className="h-4 w-4 text-blue-600" />
    case "Resolved":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    case "Rejected":
      return <AlertCircle className="h-4 w-4 text-red-600" />
  }
}

function getStatusBadge(status: Report["status"]) {
  const variants: Record<Report["status"], "default" | "outline" | "secondary"> = {
    "Pending": "default",
    "Under Review": "default",
    "Resolved": "secondary",
    "Rejected": "outline",
  }
  return <Badge variant={variants[status]}>{status}</Badge>
}

export default function ReportManagement() {
  return (
    <div className="space-y-3">
      {SAMPLE_REPORTS.length === 0 ? (
        <div className="rounded-md border border-border p-8 text-center text-muted-foreground">
          <Flag className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No reports submitted yet</p>
          <p className="text-sm mt-1">Report inappropriate content to help keep the community safe</p>
        </div>
      ) : (
        SAMPLE_REPORTS.map((report) => (
          <article
            key={report.id}
            className="rounded-md border border-border p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(report.status)}
                  <h3 className="text-base font-medium">{report.entityTitle}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline">{report.entityType}</Badge>
                  {getStatusBadge(report.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Reason: {report.reportReason}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Reported on {new Date(report.reportDate).toLocaleDateString()}</span>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
