import React from 'react';
import { Shield, ShieldCheck, Lock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Security features indicator component
 */
export const SecurityIndicator: React.FC = () => {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security protocols'
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'JWT tokens with automatic refresh and expiry'
    },
    {
      icon: Eye,
      title: 'Privacy Protected',
      description: 'Your data is encrypted and never shared'
    }
  ];

  return (
    <Card className="mt-6 border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Secure & Private</h3>
        </div>
        <div className="space-y-2">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <feature.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">{feature.title}</p>
                <p className="text-xs text-blue-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};