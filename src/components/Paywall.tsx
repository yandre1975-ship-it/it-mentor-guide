import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Zap } from 'lucide-react';

export function Paywall({ feature }: { feature: string }) {
  return (
    <Card className="p-6 text-center space-y-3 bg-primary/5 border-primary/20">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Lock className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold">{feature} — в Pro-версии</p>
        <p className="text-sm text-muted-foreground mt-1">
          Оформите подписку, чтобы получить полный доступ ко всем функциям.
        </p>
      </div>
      <Button size="sm" onClick={() => {
        localStorage.setItem('it-library-pro', 'true');
        window.location.reload();
      }}>
        <Zap className="h-4 w-4 mr-1" /> Активировать Pro (демо)
      </Button>
    </Card>
  );
}
