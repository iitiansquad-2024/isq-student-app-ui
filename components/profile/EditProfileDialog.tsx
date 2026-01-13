"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Mail } from "lucide-react"

const EXAM_OPTIONS = ["JEE", "NEET", "BITSAT", "KVPY", "NTSE", "Olympiad"]

type EditProfileDialogProps = {
  profile: {
    name: string
    email: string
    preferredExam: string
  }
  onSave: (profile: { name: string; email: string; preferredExam: string }) => void
  onCancel: () => void
}

export default function EditProfileDialog({ profile, onSave, onCancel }: EditProfileDialogProps) {
  const [editedProfile, setEditedProfile] = useState(profile)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  function handleEmailChange(email: string) {
    if (email !== profile.email && email.includes("@")) {
      setNewEmail(email)
      setShowOtpDialog(true)
    } else {
      setEditedProfile({ ...editedProfile, email })
    }
  }

  function sendOtp() {
    setOtpSent(true)
  }

  function verifyOtp() {
    if (otp.length === 6) {
      setEditedProfile({ ...editedProfile, email: newEmail })
      setShowOtpDialog(false)
      setOtpSent(false)
      setOtp("")
      setNewEmail("")
    }
  }

  function handleSave() {
    onSave(editedProfile)
  }

  return (
    <>
      <div className="space-y-3">
        <div>
          <label className="text-xs block mb-1">Name</label>
          <Input 
            value={editedProfile.name} 
            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })} 
          />
        </div>
        <div>
          <label className="text-xs block mb-1 flex items-center gap-2">
            Email
            <Mail className="h-3 w-3 text-muted-foreground" />
          </label>
          <Input 
            type="email" 
            value={editedProfile.email} 
            onChange={(e) => handleEmailChange(e.target.value)} 
          />
          <p className="text-xs text-muted-foreground mt-1">Changing email requires OTP verification</p>
        </div>
        <div>
          <label className="text-xs block mb-1">Preferred exam</label>
          <Select 
            value={editedProfile.preferredExam} 
            onValueChange={(val) => setEditedProfile({ ...editedProfile, preferredExam: val })}
          >
            {EXAM_OPTIONS.map((exam) => (
              <SelectItem key={exam} value={exam}>{exam}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>

      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Email Change</DialogTitle>
            <DialogDescription>
              We need to verify your new email address: {newEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!otpSent ? (
              <Button onClick={sendOtp} className="w-full">
                Send OTP
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs block mb-1">Enter 6-digit OTP</label>
                  <Input 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <Button onClick={verifyOtp} className="w-full" disabled={otp.length !== 6}>
                  Verify OTP
                </Button>
                <Button onClick={sendOtp} variant="ghost" className="w-full" size="sm">
                  Resend OTP
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
