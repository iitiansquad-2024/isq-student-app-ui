"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/ui/footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { requestOtp, signUp, initiateGoogleOAuth } from '@/lib/authApi';
import { motion, AnimatePresence, type Variants } from "framer-motion";

const examNames = [
  "JEE Main",
  "JEE Advanced",
  "BITSAT",
  "VITEEE",
  "NEET UG",
  "WBJEE",
  "MHT CET",
  "COMEDK",
  "SRMJEEE",
  "KIITEE",
];

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
  },
};

type SignUpStep = 'initial' | 'email-entry' | 'user-details';

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Google OAuth would be initiated here');
    } catch (err: any) {
      setSignupError(err.message || 'Failed to initiate Google signup');
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = () => {
    setCurrentStep('email-entry');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    const email = formData.email.trim();
    if (!email) {
      setOtpError('Please enter a valid email address');
      return;
    }

    try {
      setIsRequestingOtp(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setCurrentStep('user-details');
    } catch (error: any) {
      setOtpError(error?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!formData.name.trim()) {
      setSignupError('Please enter your name');
      return;
    }
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      setSignupError('Please enter a valid 6-digit OTP');
      return;
    }
    if (formData.password.length < 4) {
      setSignupError('Password must be at least 4 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/login?registered=true');
    } catch (error: any) {
      setSignupError(error?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInitialStep = () => (
    <motion.div variants={stepVariants} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={itemVariants} className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold">Join IITian Squad</h2>
        <p className="text-muted-foreground">
          Create your account to start your exam preparation journey
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button 
          onClick={handleGoogleSignUp}
          variant="outline" 
          className="w-full"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants} className="relative flex justify-center">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase bg-background w-fit">
          <span className="bg-transparent sm:bg-background px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button 
          onClick={handleEmailSignUp}
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
        >
          Sign up with Email
        </Button>
      </motion.div>
      
      <motion.div variants={itemVariants} className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-yellow-600 hover:underline font-medium">
          Sign in
        </Link>
      </motion.div>
    </motion.div>
  );

  const renderEmailEntry = () => (
    <motion.div variants={stepVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCurrentStep('initial')}
          className="w-fit p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">Enter Your Email</h2>
          <p className="text-muted-foreground">We'll send you a verification code</p>
        </div>
      </motion.div>
      <motion.form variants={itemVariants} onSubmit={handleEmailSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {otpError && (
            <p className="text-sm text-red-600 mt-1">{otpError}</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          disabled={isRequestingOtp}
        >
          {isRequestingOtp ? 'Sending...' : 'Send Verification Code'}
        </Button>
      </motion.form>
    </motion.div>
  );

  const renderUserDetails = () => (
    <motion.div variants={stepVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setCurrentStep('email-entry');
            setOtpSent(false);
          }}
          className="w-fit p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <div className="text-muted-foreground">
            {otpSent && (
              <span className="text-green-600 block mb-1">
                ✓ Verification code sent to {formData.email}
              </span>
            )}
            Enter the code and set up your account
          </div>
        </div>
      </motion.div>
      <motion.form variants={itemVariants} onSubmit={handleFinalSubmit} className="space-y-4">
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
            <div className="text-center text-sm">
              Didn't receive the code?{' '}
              <button 
                type="button" 
                className="text-yellow-600 hover:underline font-medium"
                disabled={isRequestingOtp}
                onClick={async () => {
                  try {
                    setIsRequestingOtp(true);
                    setSignupError(null);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setOtpSent(true);
                  } catch (error: any) {
                    setSignupError(error?.message || 'Failed to resend verification code.');
                  } finally {
                    setIsRequestingOtp(false);
                  }
                }}
              >
                {isRequestingOtp ? 'Sending...' : 'Resend'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min 4 characters)"
                value={formData.password}
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span>✗</span> Passwords do not match
              </p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 4 && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span>✓</span> Passwords match
              </p>
            )}
          </div>

          {signupError && (
            <p className="text-sm text-red-600 text-center">{signupError}</p>
          )}
          
        <Button 
          type="submit" 
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </motion.form>
    </motion.div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center py-[10dvh] px-0 sm:px-6">
        <motion.div 
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="space-y-6 sm:rounded-3xl sm:border sm:border-white/30 sm:bg-white/90 sm:p-10 sm:shadow-2xl sm:backdrop-blur-xl dark:sm:border-slate-800/60 dark:sm:bg-slate-900/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {currentStep === 'initial' && renderInitialStep()}
              {currentStep === 'email-entry' && renderEmailEntry()}
              {currentStep === 'user-details' && renderUserDetails()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="border-y border-border bg-muted/40 py-6 overflow-hidden">
        <div className="relative">
          <div className="flex gap-4 whitespace-nowrap" style={{ animation: "exam-scroll 22s linear infinite" }}>
            {[...examNames, ...examNames].map((exam, index) => (
              <div
                key={`${exam}-${index}`}
                className="rounded-full border border-border/70 bg-background/80 px-6 py-2 text-sm font-medium text-muted-foreground shadow-sm"
              >
                {exam} Practice
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes exam-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
