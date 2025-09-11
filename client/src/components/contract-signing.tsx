import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  FileText, 
  Pen, 
  Calendar,
  Shield,
  User
} from "lucide-react";

interface Contract {
  id: string;
  title: string;
  templateContent: string;
  totalAmount?: string;
  createdAt: string;
}

interface ContractSigningProps {
  contract: Contract;
  onSign: (signatureData: {
    fullName: string;
    date: string;
    signature: string;
    signatureMethod: 'type' | 'draw';
    ipAddress: string | null;
    userAgent: string;
    timestamp: string;
    userId?: string;
    userEmail?: string;
    contentHash: string;
  }) => void;
  onCancel: () => void;
}

// Helper function to generate content hash
const generateContentHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default function ContractSigning({ contract, onSign, onCancel }: ContractSigningProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [esignConsent, setEsignConsent] = useState(false);
  const [signatureMethod, setSignatureMethod] = useState<'type' | 'draw'>('type');
  const [contentHash, setContentHash] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Generate content hash on component mount
  useEffect(() => {
    const generateHash = async () => {
      const hash = await generateContentHash(contract.templateContent);
      setContentHash(hash);
    };
    generateHash();
  }, [contract.templateContent]);

  // Set fullName from authenticated user if available
  useEffect(() => {
    if (user && user.email && !fullName) {
      // Extract name from email or use email as fallback
      const nameFromEmail = user.email.split('@')[0].replace(/[._]/g, ' ');
      setFullName(nameFromEmail);
    }
  }, [user, fullName]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  // Touch event handlers for mobile support
  const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const touch = e.touches[0];
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  };

  const stopTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignature(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const handleSign = async () => {
    if (!fullName || !agreedToTerms || !esignConsent) {
      toast({
        title: "Please complete all required fields",
        description: "Name, agreement to terms, and ESIGN consent are required.",
        variant: "destructive"
      });
      return;
    }

    if (signatureMethod === 'draw' && !signature) {
      toast({
        title: "Signature required",
        description: "Please draw your signature in the box above.",
        variant: "destructive"
      });
      return;
    }

    if (!contentHash) {
      toast({
        title: "Processing document",
        description: "Please wait while we process the document hash.",
        variant: "destructive"
      });
      return;
    }

    // Get client IP
    let clientIP = null;
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      clientIP = data.ip;
    } catch (error) {
      console.log('Could not fetch IP address:', error);
    }

    const signatureData = {
      fullName,
      date,
      signature: signatureMethod === 'type' ? fullName : signature,
      signatureMethod,
      ipAddress: clientIP,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: user?.id,
      userEmail: user?.email,
      contentHash
    };

    onSign(signatureData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Contract Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span data-testid="text-contract-title">{contract.title}</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-contract-date">Created: {new Date(contract.createdAt).toLocaleDateString()}</span>
            </div>
            {contract.totalAmount && (
              <div className="flex items-center space-x-1" data-testid="div-contract-amount">
                <span>Amount: ${parseFloat(contract.totalAmount).toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div 
              className="whitespace-pre-wrap border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto leading-relaxed"
              data-testid="div-contract-content"
            >
              {contract.templateContent}
            </div>
          </div>
          {/* Document integrity info */}
          {contentHash && (
            <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Document Hash: {contentHash.substring(0, 16)}...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* E-Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pen className="h-5 w-5" />
            <span>Electronic Signature</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Please review the contract above and provide your electronic signature below.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signature Method Selection */}
          <div className="space-y-4">
            <Label>Signature Method</Label>
            <div className="flex space-x-4">
              <Button
                variant={signatureMethod === 'type' ? 'default' : 'outline'}
                onClick={() => setSignatureMethod('type')}
                data-testid="button-signature-type"
              >
                Type Name
              </Button>
              <Button
                variant={signatureMethod === 'draw' ? 'default' : 'outline'}
                onClick={() => setSignatureMethod('draw')}
                data-testid="button-signature-draw"
              >
                Draw Signature
              </Button>
            </div>
          </div>

          {/* Signature Input */}
          {signatureMethod === 'type' ? (
            <div className="space-y-2">
              <Label htmlFor="typed-signature">Type Your Full Legal Name</Label>
              <Input
                id="typed-signature"
                type="text"
                placeholder="Enter your full legal name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-lg font-script"
                style={{ fontFamily: 'cursive' }}
                data-testid="input-typed-signature"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Draw Your Signature</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  className="border border-gray-200 rounded cursor-crosshair bg-white w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startTouchDrawing}
                  onTouchMove={touchDraw}
                  onTouchEnd={stopTouchDrawing}
                  data-testid="canvas-drawn-signature"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    Draw your signature in the box above
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSignature}
                    data-testid="button-clear-signature"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Legal Name</Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  data-testid="input-full-name"
                />
              </div>
            </div>
          )}

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="signature-date">Date</Label>
            <Input
              id="signature-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-signature-date"
            />
          </div>

          <Separator />

          {/* Legal Agreements */}
          <div className="space-y-4">
            {/* User Authentication Info */}
            {isAuthenticated && user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3" data-testid="div-auth-info">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-green-600" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Authenticated User</p>
                    <p className="text-green-700">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* ESIGN Consent - Must come first */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="esign-consent"
                checked={esignConsent}
                onCheckedChange={(checked) => setEsignConsent(checked as boolean)}
                data-testid="checkbox-esign-consent"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="esign-consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ESIGN Act Consent - Electronic Signature Agreement
                </label>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>By checking this box, I consent to use electronic signatures and agree that:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>Electronic signatures are valid and legally binding</li>
                    <li>I can access and retain electronic documents</li>
                    <li>I have the necessary hardware and software to access documents</li>
                    <li>I can request paper copies if needed</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                data-testid="checkbox-terms-agreement"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms-agreement"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
                <p className="text-xs text-muted-foreground">
                  By checking this box, I acknowledge that I have read, understood, and agree to be bound by all terms and conditions outlined in this contract.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="div-legal-notice">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Electronic Signature Legal Notice</p>
                  <p className="text-blue-700 mt-1">
                    Your electronic signature has the same legal effect as a handwritten signature. 
                    This document will be legally binding once signed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel}
              data-testid="button-cancel-signing"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSign}
              disabled={!fullName || !agreedToTerms || !esignConsent || !contentHash}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-sign-contract"
            >
              <Pen className="h-4 w-4 mr-2" />
              Sign Contract
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}