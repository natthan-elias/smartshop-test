import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, Purchase } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, ShoppingBag, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const History = () => {
  const { getPurchaseHistory } = useCart();
  const navigate = useNavigate();
  const purchases = getPurchaseHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary text-primary-foreground p-4 rounded-b-3xl shadow-soft">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/setup')} className="text-primary-foreground hover:bg-primary-foreground/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Histórico de Compras</h1>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-3">
        {purchases.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhuma compra registrada</p>
            <p className="text-sm">Finalize uma compra para ver aqui</p>
          </div>
        ) : (
          purchases.map((purchase: Purchase) => {
            const savings = purchase.budget - purchase.total;
            const overBudget = savings < 0;
            
            return (
              <Card key={purchase.id} className="shadow-soft animate-in fade-in slide-in-from-left-2 duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(purchase.date)}</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        R$ {purchase.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Orçamento: R$ {purchase.budget.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.items.length} {purchase.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                      overBudget 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-primary/10 text-primary"
                    )}>
                      {overBudget ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      R$ {Math.abs(savings).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
