"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/ui/footer';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { requestOtp, resetPassword } from '@/lib/authApi';

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestOtp = async () => {
    setError(null);

    const email = formData.email.trim();
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsRequestingOtp(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch (error: any) {
      setError(error?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    if (!formData.newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    try {
      setIsResetting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password reset successful! Please login with your new password.');
      window.location.href = '/login';
    } catch (error: any) {
      setError(error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-background dark:to-muted">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">IITian Squad</h1>
            <p className="text-muted-foreground">Your exam preparation companion</p>
          </div>

          <Card className="w-full shadow-xl">
            <CardHeader className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.href = '/login'}
                className="self-start p-0 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Button>
              
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email and we'll send you a code to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={otpSent}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRequestOtp}
                      disabled={isRequestingOtp || !formData.email.trim() || otpSent}
                    >
                      {isRequestingOtp ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={formData.otp}
                        onChange={handleInputChange}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                {otpSent && (
                  <>
                    <Button 
                      type="submit" 
                      className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      disabled={isResetting}
                    >
                      {isResetting ? 'Resetting...' : 'Reset Password'}
                    </Button>

                    <div className="text-center text-sm">
                      Didn't receive the code?{' '}
                      <button 
                        type="button" 
                        className="text-yellow-600 hover:underline font-medium"
                        disabled={isRequestingOtp}
                        onClick={async () => {
                          try {
                            setIsRequestingOtp(true);
                            setError(null);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            setOtpSent(true);
                          } catch (error: any) {
                            setError(error?.message || 'Failed to resend reset code.');
                          } finally {
                            setIsRequestingOtp(false);
                          }
                        }}
                      >
                        {isRequestingOtp ? 'Sending...' : 'Resend'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
