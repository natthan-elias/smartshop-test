import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DollarSign, ShoppingBag, History, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Setup = () => {
  const [budgetInput, setBudgetInput] = useState('');
  const { setBudget } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    const value = parseFloat(budgetInput.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      toast({ title: 'Erro', description: 'Informe um orçamento válido', variant: 'destructive' });
      return;
    }
    setBudget(value);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">SmartShop</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
              <History className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Defina seu Orçamento</CardTitle>
            <CardDescription>
              Quanto você pretende gastar nesta compra?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                R$
              </span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="pl-14 h-16 text-3xl font-bold text-center"
              />
            </div>
            <Button onClick={handleStart} className="w-full h-14 text-lg gradient-primary gap-2">
              <ShoppingBag className="w-6 h-6" />
              Iniciar Compras
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Controle seus gastos e economize mais!
        </p>
      </div>
    </div>
  );
};

export default Setup;
